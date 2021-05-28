const api = require('../api');
const logger = require('../../logger')(__filename);

async function activateVoucher(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];
    ctx.answerCbQuery();

    const voucher = await api.get(`/clients/voucher/${id}`);

    const date = new Date();
    const usableTo = Date.parse(voucher.usable_to);

    if (voucher.status !== 'pending' || date.getTime() > usableTo)
      throw new Error('Купон використаний');

    await api.put(`/clients/voucher/${id}/activate`);

    ctx.deleteMessage(ctx.update.callback_query.message.id);
    ctx.reply('Купон витрачений!');
  } catch (error) {
    ctx.reply(`Не можу активувати купон!`);
    logger.error(error.message || error);
  }
}

module.exports = { activateVoucher };
