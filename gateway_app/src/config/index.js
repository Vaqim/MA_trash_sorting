require('dotenv').config({ path: `${process.env.PWD}/.env` });
const fatal = require('../service/fatal');

const config = {
  port: process.env.PORT || 3000,
  accessSecret: process.env.ACCESS_TOKEN_SECRET || fatal('No access key'),
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || fatal('No refresh key'),
  urls: {
    client: process.env.CLIENT_URL || fatal('No client microservice URL'),
    organization: process.env.ORGANIZATION_URL || fatal('No client microservice URL'),
    reciever: process.env.RECIEVER_URL || fatal('No client microservice URL'),
    points: process.env.POINTS_URL || fatal('No client microservice URL'),
  },
};

module.exports = config;
