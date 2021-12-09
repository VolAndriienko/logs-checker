#https://dev.to/dariansampare/setting-up-docker-typescript-node-hot-reloading-code-changes-in-a-running-container-2b2f
FROM node:14

WORKDIR /logs-checker

COPY ./package*.json ./

RUN npm i

COPY . .