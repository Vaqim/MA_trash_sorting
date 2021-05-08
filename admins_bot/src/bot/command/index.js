const { Scenes, Markup } = require('telegraf');
const logger = require('../../logger')(__filename);
const orgScenes = require('./organization');
const recScenes = require('./reciever');
const api = require('../api');
const { orgKeyboard, recKeyboard } = require('./keyboards');

const creationScene = new Scenes.WizardScene(
  'CREATION_SCENE_ID',
  async (ctx) => {
    ctx.wizard.state.creationData = {};
    await ctx.reply(
      'Кто это?',
      Markup.inlineKeyboard([
        Markup.button.callback('Организация', 'organization'),
        Markup.button.callback('Точка приема мусора', 'reciever'),
      ]),
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { data: type, from } = ctx.update.callback_query;
    let data;
    if (type === 'organization') {
      data = await api.get(`/organization/bot/${from.id}`);
    } else {
      data = await api.get(`/recievers/bot/${from.id}`);
    }
    ctx.answerCbQuery();
    if (typeof data === 'object') {
      const currentKeyboard = type === 'organization' ? orgKeyboard : recKeyboard;
      await ctx.reply('Такой пользователь уже существует', currentKeyboard);
      return ctx.scene.leave();
    }
    ctx.wizard.state.creationData.userType = type;
    await ctx.reply('Теперь введите название');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.creationData.name = ctx.message.text;
    await ctx.reply('Теперь введите номер телефона, по которому можна обратиться к организации');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.creationData.phone = ctx.message.text;
    await ctx.reply('Теперь введите адресс по которому можна вас найти');
    return ctx.wizard.next();
  },
  async (ctx) => {
    try {
      ctx.wizard.state.creationData.address = ctx.message.text;
      ctx.wizard.state.creationData.telegram_id = ctx.message.from.id;
      ctx.wizard.state.creationData.login = ctx.message.from.username;

      const data = await api.post('/auth/registration', ctx.wizard.state.creationData);
      const currentKeyboard =
        ctx.wizard.state.creationData.userType === 'organization' ? orgKeyboard : recKeyboard;
      await ctx.reply(
        `Отлично!\nНазвание: ${data.name}\nПароль: ${data.password}`,
        currentKeyboard,
      );
      return ctx.scene.leave();
    } catch (error) {
      ctx.reply('Что-то не получилось');
      logger.error(error);
    }
  },
);

module.exports = { orgScenes, recScenes, creationScene };
