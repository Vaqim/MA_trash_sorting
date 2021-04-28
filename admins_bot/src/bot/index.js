const { Telegraf, Scenes, session } = require('telegraf');
const { creationScene, serviceScene, creationServiceScene } = require('./command');
const { botToken } = require('../config');

const bot = new Telegraf(botToken);

const stage = new Scenes.Stage([creationScene, serviceScene, creationServiceScene]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter('CREATION_SCENE_ID'));
bot.hears('Просмотреть сервисы', (ctx) => ctx.scene.enter('SERVICE_SCENE_ID'));
bot.hears('Создать сервисы', (ctx) => ctx.scene.enter('CREATION_SERVICE_SCENE_ID'));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
