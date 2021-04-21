const { Telegraf } = require('telegraf');
const { botToken } = require('../config');

const bot = new Telegraf(botToken);

bot.start((ctx) => {
  ctx.reply('Welcome');
});

module.exports = bot;
