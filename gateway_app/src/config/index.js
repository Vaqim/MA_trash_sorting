require('dotenv').config({ path: `${process.env.PWD}/.env` });
const fatal = require('../service/fatal');

const config = {
  port: process.env.PORT || 3000,
  accessSecret: process.env.ACCESS_TOKEN_SECRET || fatal('No access key'),
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || fatal('No refresh key'),
  botToken: process.env.BOT_TOKEN || fatal('No bot token'),
  urls: {
    client: {
      host: process.env.CLIENT_HOST || fatal('No client microservice host'),
      port: process.env.CLIENT_PORT || fatal('No client microservice port'),
    },
    organization: {
      host: process.env.ORGANIZATION_HOST || fatal('No organization microservice host'),
      port: process.env.ORGANIZATION_PORT || fatal('No organization microservice port'),
    },
    reciever: {
      host: process.env.RECIEVERS_HOST || fatal('No reciever microservice host'),
      port: process.env.RECIEVERS_PORT || fatal('No reciever microservice port'),
    },
    points: {
      host: process.env.POINTS_HOST || fatal('No points microservice host'),
      port: process.env.POINTS_PORT || fatal('No points microservice port'),
    },
  },
};

module.exports = config;
