const { Markup } = require('telegraf');
const api = require('../api');
const generateUser = require('../../service/generateUser');
const logger = require('../../logger')(__filename);

const keyboard = Markup.keyboard([
  'Я хочу что-то купить \u{1F911}',
  'Мой баланс \u{1F4B5}',
  'Информация про пункты здачи мусора \u{1F914}',
]).resize();

async function createUser(ctx) {
  try {
    const data = generateUser(ctx.message);

    const user = await api.post(`/auth/registration`, data);

    ctx.reply(
      `Привет! \u{1F44B} Вот твои данные\nLogin: ${user.login}\nPassword: ${user.password}`,
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

    ctx.reply(`У тебя сейчас ${user.balance} балов`);
  } catch (error) {
    ctx.reply(`К сожалению не получилось найти пользователя`);
    logger.error(error.message || error);
  }
}

module.exports = { createUser, getUser };
