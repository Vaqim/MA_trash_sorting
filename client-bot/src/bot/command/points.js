const api = require('../api');
const logger = require('../../logger')(__filename);

async function spendPoints(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const serviceId = data.split(' ')[1];
    const clientId = ctx.from.id;

    await api.post(`/points/spend`, { clientId, serviceId });

    ctx.reply('Покупка совершена!\n');
  } catch (error) {
    logger.error('error.message' || error);
    throw error;
  }
}

async function earnPoints(ctx) {
  try {
    // TODO
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { spendPoints, earnPoints };
