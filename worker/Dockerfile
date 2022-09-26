# production dockerfile
FROM node:14-alpine

WORKDIR "/app"

COPY package.json .
RUN npm install -g npm@8.19.2
RUN npm i
COPY . .

# use start script from package.json file
# "scripts": {
# "start": "node index.js",
# "dev": "nodemon"
# }
CMD ["npm", "run", "start"]
