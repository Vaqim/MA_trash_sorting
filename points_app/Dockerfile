FROM node:14-alpine

WORKDIR usr/src/points-service

RUN apk update && apk upgrade

RUN npm i npm@latest -g

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENTRYPOINT ["npm"]
CMD ["start"]