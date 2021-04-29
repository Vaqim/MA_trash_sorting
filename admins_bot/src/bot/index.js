const { Telegraf, Scenes, session } = require('telegraf');
const {
  creationScene,
  deleteServiceScene,
  changeServiceScene,
  creationServiceScene,
  infoServiceScene,
} = require('./command');
const { botToken } = require('../config');

const bot = new Telegraf(botToken);

const stage = new Scenes.Stage([
  creationScene,
  deleteServiceScene,
  creationServiceScene,
  changeServiceScene,
  infoServiceScene,
]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter('CREATION_SCENE_ID'));
bot.hears('Просмотреть сервисы', (ctx) => ctx.scene.enter('INFO_SERVICE_SCENE_ID'));
bot.hears('Создать сервисы', (ctx) => ctx.scene.enter('CREATION_SERVICE_SCENE_ID'));
bot.hears('Удалить сервисы', (ctx) => ctx.scene.enter('DELETE_SERVICE_SCENE_ID'));
bot.hears('Изменить сервисы', (ctx) => ctx.scene.enter('CHANGE_SERVICE_SCENE_ID'));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
