FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD [ "yarn", "start" ]