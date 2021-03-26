FROM node:14-alpine

WORKDIR /usr/src/app

RUN apk update && apk upgrade

COPY package*.json ./

RUN npm i -g npm && npm i

COPY . .

ENTRYPOINT [ "npm" ]
CMD [ "start" ]