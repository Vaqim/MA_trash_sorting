const api = require('../api');
const logger = require('../../logger');

async function getUser(ctx) {
  try {
    const { id } = ctx.message.from;

    const user = await api.get(`/clients/${id}`);

    ctx.reply(`${user.login}`);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function changeUser(ctx) {
  // TODO
}

module.exports = { getUser, changeUser };
