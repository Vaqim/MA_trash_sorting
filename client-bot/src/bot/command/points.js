const api = require('../api');
const logger = require('../../logger')(__filename);

async function spendPoints(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const serviceId = data.split(' ')[1];
    const clientId = ctx.from.id;

    const service = await api.get(`/organization/services/${serviceId}`);

    await api.post(`/points/spend`, { clientId, serviceId });

    ctx.answerCbQuery();
    ctx.reply(`Круто!\nТы потратил ${service.price} на ${service.name}\nНаслаждайся! \u{270C}`);
  } catch (error) {
    ctx.reply(`Боюсь у тебя не достаточно балов \u{1F614}`);
    logger.error(error.message || error);
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
