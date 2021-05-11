require('dotenv').config();
const fatal = require('../utils/fatal');

const config = {
  botToken: process.env.BOT_TOKEN || fatal('Bot token wasn`t defined!'),
  nodeEnv: process.env.NODE_ENV || 'production',
};

module.exports = config;
