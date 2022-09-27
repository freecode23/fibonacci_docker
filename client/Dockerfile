FROM node:14-alpine as builder_container

WORKDIR "/app"

COPY package.json .
RUN npm install -g npm@8.19.2
RUN npm i
COPY . .
RUN npm run build

# 2. Nginx serving phase
# copy the builder_container phase above folder to this NGINX container
# from "/app/build" to ""
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder_container /app/build /usr/share/nginx/html

# will run start nginx by default 