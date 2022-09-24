const redisKeys = require("./redisKeys");
const redis = require("redis");

// 1. create redis client
const redisClient = redis.createClient({
    host: redisKeys.redisHost,
    port: redisKeys.redisPort,
    // retry connect every 1000ms
    retry_strategy: () => 1000
})

// 2. make a duplicate of redisClient
const redisDup = redisClient.duplicate();


// 3. function to calculate fib
function fib(index) {
    if (index < 3) return 1;
    return fib(index-1) + fib(index-2);
}
// 4. set up redis to listen to insert event and do something with the message in that event
// - anytime we get a new message run the callback function
redisDup.on("message", (channel, message) => {
    console.log("redis get message");

    // create hashset called idxFibval
    // calculate the fib
    // insert it into a hash
    // the key will be message - which is the index values
    // the value will is the fib val
    redisClient.hset("idxFibval", message, fib(parseInt(message)));
} )

// - anytime there is an insert event, we will get that value
redisDup.subscribe("insert");