const api = require('../api');
const logger = require('../../logger')(__filename);

async function activateVoucher(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];

    await api.post(`/clients/voucher/${id}/activate`);

    ctx.answerCbQuery();
    ctx.deleteMessage(ctx.update.callback_query.message.id);
    ctx.reply('Купон потрачен!');
  } catch (error) {
    ctx.reply(`Err`);
    logger.error(error.message || error);
  }
}

module.exports = { activateVoucher };
