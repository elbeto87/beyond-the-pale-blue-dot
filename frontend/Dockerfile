FROM node:20-slim

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ARG API_PROXY_TARGET=http://localhost:8000
ENV API_PROXY_TARGET=$API_PROXY_TARGET

CMD ["npm", "run", "dev"]
