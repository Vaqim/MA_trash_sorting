const { Telegraf, Scenes, session } = require('telegraf');
const { orgScenes, recScenes, creationScene } = require('./scenes');
const { botToken } = require('../config');

const bot = new Telegraf(botToken);

const stage = new Scenes.Stage([...orgScenes, ...recScenes, creationScene]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter('CREATION_SCENE_ID'));
bot.hears('Переглянути сервіси', (ctx) => ctx.scene.enter('INFO_SERVICE_SCENE_ID'));
bot.hears('Створити сервіси', (ctx) => ctx.scene.enter('CREATION_SERVICE_SCENE_ID'));
bot.hears('Видалити сервіси', (ctx) => ctx.scene.enter('DELETE_SERVICE_SCENE_ID'));
bot.hears('Змінити сервіси', (ctx) => ctx.scene.enter('CHANGE_SERVICE_SCENE_ID'));
bot.hears('Змінити організацію', (ctx) => ctx.scene.enter('CHANGE_ORGANIZATION_SCENE_ID'));

bot.hears('Переглянути позиції', (ctx) => ctx.scene.enter('INFO_TRASHTYPE_SCENE_ID'));
bot.hears('Створити позиції', (ctx) => ctx.scene.enter('CREATE_TRASHTYPE_SCENE_ID'));
bot.hears('Змінити позиції', (ctx) => ctx.scene.enter('DELETE_TRASHTYPE_SCENE_ID'));
bot.hears('Видалити позиції', (ctx) => ctx.scene.enter('CHANGE_TRASHTYPE_SCENE_ID'));
bot.hears('Нарахувати бали', (ctx) => ctx.scene.enter('CALCULATE_TRASH_SCENE_ID'));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
