const keys = require("./keys");


const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express();
app.use(cors())
app.use(bodyParser.json());


// A. Postgres Client setup
// get the Pool module
const {Pool} = require("pg");

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
})
pgClient.on("error", () => {
    console.log("Lost PG connection");
});


pgClient.on("connect", (client) => {
    // create table called values
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error(err));
});


// B. Redis Client setup
const redis = require("redis");

// - create redis client
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    // retry connect every 1000ms
    retry_strategy: () => 1000
})

async function run() {
    try {

        await redisClient.connect();
        console.log("client is open", redisClient.isOpen); // this is false
    } catch (err) {
        console.log("err", err);
    }
}

run()


// - make a duplicate of redisClient
const redisDup = redisClient.duplicate();

// C. Express Route handlers
app.get("/", (req, res) => {
    res.send("hi");
})

// get data from PG
app.get("/values/all", async (req, res) => {
    console.log("values/all>>>");
    try {

        const values = await pgClient.query("SELECT * from values");
        res.send(values.rows);
    } catch (err) {
        console.log("err>>>", err);
    }
    
})

// get data from Redis
app.get("/values/current", async (req, res) => {
    console.log("values/current>>>");

    try {
        await redisClient.hGetAll("idxFibval", (err, values) => {
            res.send(values)
            console.log("values",values);
        })

        console.log("finish redis");
    } catch (err) {
        console.log(">>>>>>>>err values curent>>>>", err);
    }
})

// get new index from react
app.post("/values", async (req, res) => {

    console.log("values/>>>");
    try {

        const index = req.body.index;
        if (parseInt(index) > 40) {
            return res.status(422).send("index to high");
        }
       
        // insert to redis
        redisClient.hSet("idxFibval", index, "nothing yet");
        
    
        // start calculating the fib value
        redisDup.publish("insert", index);
    
        // pgClient store the index
        pgClient.query("INSERT INTO values(number) VALUES($1)", [index])
        res.send({working: true})

    } catch (err) {
        console.log("err inserting values", err);
    }
})

app.listen(5000, err=> {
    console.log("listening to 5000");
})