const { Telegraf } = require('telegraf');
const { config } = require('../config');

const bot = Telegraf(config.botToken);

bot.start((ctx) => ctx.reply('Hello'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
