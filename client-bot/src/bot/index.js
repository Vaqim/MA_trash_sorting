const { Telegraf } = require('telegraf');
const config = require('../config');

const bot = new Telegraf(config.botToken);

// Можно использовать id телеграма для определения юзера
bot.start((ctx) => ctx.reply('Hello'));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.export = bot;
