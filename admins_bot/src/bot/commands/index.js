const { Markup } = require('telegraf');
const { orgKeyboard, recKeyboard } = require('./keyboards');
const organizationCommands = require('./organization');
const recieverCommands = require('./reciever');
const logger = require('../../logger')(__filename);
const api = require('../api');

async function defineUser(ctx) {
  ctx.wizard.state.creationData = {};
  await ctx.reply(
    'Хто це?',
    Markup.inlineKeyboard([
      Markup.button.callback('Організація', 'organization'),
      Markup.button.callback('Точка прийому сміття', 'reciever'),
    ]),
  );
  return ctx.wizard.next();
}

async function findUserOrSetName(ctx) {
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
    await ctx.reply('Такий користувач вже існує', currentKeyboard);
    return ctx.scene.leave();
  }
  ctx.wizard.state.creationData.userType = type;
  await ctx.reply('Тепер введіть назву');
  return ctx.wizard.next();
}

async function setPhone(ctx) {
  ctx.wizard.state.creationData.name = ctx.message.text;
  await ctx.reply('Тепер введіть номер телефону, за яким можна звернутися до організації');
  return ctx.wizard.next();
}

async function setAddress(ctx) {
  ctx.wizard.state.creationData.phone = ctx.message.text;
  await ctx.reply('Тепер введіть адресу за якою можна вас знайти');
  return ctx.wizard.next();
}

async function registerUser(ctx) {
  try {
    ctx.wizard.state.creationData.address = ctx.message.text;
    ctx.wizard.state.creationData.telegram_id = ctx.message.from.id;
    ctx.wizard.state.creationData.login = ctx.message.from.username;

    const data = await api.post('/auth/registration', ctx.wizard.state.creationData);
    const currentKeyboard =
      ctx.wizard.state.creationData.userType === 'organization' ? orgKeyboard : recKeyboard;
    await ctx.reply(
      `Ось вашi даннi!\nНазва: ${data.login}\nПароль: ${data.password}`,
      currentKeyboard,
    );
    return ctx.scene.leave();
  } catch (error) {
    logger.error(error);
    return ctx.reply('Не вдалося створити користувача');
  }
}

const mainCommands = [defineUser, findUserOrSetName, setPhone, setAddress, registerUser];

module.exports = { mainCommands, organizationCommands, recieverCommands };
