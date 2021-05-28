const { Markup } = require('telegraf');
const api = require('../api');
const generateUser = require('../../service/generateUser');
const logger = require('../../logger')(__filename);

const keyboard = Markup.keyboard([
  'Я хочу щось купити \u{1F911}',
  'Мій баланс \u{1F4B5}',
  'Інформація про пункти здачі сміття \u{1F914}',
]).resize();

async function createUser(ctx) {
  try {
    const data = generateUser(ctx.message);

    const user = await api.post(`/auth/registration`, data);

    ctx.reply(
      `Привіт! \u{1F44B} Ось твої дані\nЛогiн: ${user.login}\nПароль: ${user.password}`,
      keyboard,
    );
  } catch (error) {
    ctx.reply(`Кажеться я тебя уже знаю`, keyboard);
    logger.error(error.message || error);
  }
}

async function getUser(ctx) {
  try {
    const { id } = ctx.message.from;

    const user = await api.get(`/clients/bot/${id}`);

    ctx.reply(`У тебе зараз ${user.balance} балів`);
  } catch (error) {
    ctx.reply(`На жаль не вийшло знайти користувача`);
    logger.error(error.message || error);
  }
}

module.exports = { createUser, getUser };
