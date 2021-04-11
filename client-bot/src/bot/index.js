const { Telegraf } = require('telegraf');
const config = require('../config');

const bot = new Telegraf(config.botToken);

bot.start((ctx) => ctx.reply('Hello'));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
