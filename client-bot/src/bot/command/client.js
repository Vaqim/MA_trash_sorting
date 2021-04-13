const api = require('../api');
const generateUser = require('../../service/generateUser');
const logger = require('../../logger')(__filename);

async function createUser(ctx) {
  try {
    const data = generateUser(ctx.message);

    const user = await api.post(`/auth/registration`, data);
    console.log(user);
    ctx.reply(`Пользователь был создан\nLogin: ${user.login}\nPassword: ${user.password}`);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getUser(ctx) {
  try {
    const { id } = ctx.message.from;

    const user = await api.get(`/clients/bot/${id}`);

    ctx.reply(user.login);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function changeUser(ctx) {
  // TODO
}

module.exports = { createUser, getUser, changeUser };
