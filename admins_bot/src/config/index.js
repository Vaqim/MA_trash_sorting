const fatal = require('../utils/fatal');

const config = {
  botToken: process.env.BOT_TOKEN || fatal('Bot token wasn`t defined!'),
};

module.exports = config;
