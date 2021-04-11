require('dotenv').config({ path: `${process.env.PWD}/.env` });
const fatal = require('../service/fatal.js');

const config = {
  botToken: process.env.BOT_TOKEN || fatal('Token is not defined!'),
};

module.exports = config;
