require('dotenv').config({ path: `${process.env.PWD}/.env` });
const fatal = require('../service/fatal');

const config = {
  port: process.env.PORT || 3004,
  host: process.env.HOST || 'localhost',
  urls: {
    client: {
      host: process.env.CLIENT_HOST || fatal('No client microservice host'),
      port: process.env.CLIENT_PORT || fatal('No client microservice port'),
    },
    organization: {
      host: process.env.ORGANIZATION_HOST || fatal('No organization microservice host'),
      port: process.env.ORGANIZATION_PORT || fatal('No organization microservice port'),
    },
  },
};

module.exports = config;
