require('dotenv').config({ path: `${process.env.PWD}/.env` });
const fatal = require('../service/fatal');

const config = {
  port: process.env.PORT || 3000,
  accessSecret: process.env.ACCESS_TOKEN_SECRET || fatal('No access key'),
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || fatal('No refresh key'),
};

module.exports = config;
