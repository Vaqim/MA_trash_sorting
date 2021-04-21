const { Markup } = require('telegraf');
const api = require('../api');
const logger = require('../../logger')(__filename);

async function spendPoints(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const serviceId = data.split(' ')[1];
    const clientId = ctx.from.id;

    const service = await api.get(`/organization/services/${serviceId}`);

    const voucher = await api.post('/clients/voucher', {
      service_id: serviceId,
      client_id: clientId,
    });

    console.log(voucher);

    const date = new Date();
    const usableTo = Date.parse(voucher.usable_to);

    console.log('usableTo ', usableTo);

    if (voucher.status !== 'pending' || date.getTime() > usableTo)
      throw new Error('Купон использован');
    await api.post(`/points/spend`, { clientId, serviceId });

    const button = Markup.button.callback('Использовать!', `activate ${voucher.id}`);

    ctx.answerCbQuery();
    ctx.reply(
      `Круто!\nТы потратил ${service.price} на ${service.name}\nНаслаждайся!\nЭтот купон действителен до ${voucher.usable_to} \u{270C}`,
      Markup.inlineKeyboard([button]),
    );
  } catch (error) {
    ctx.reply(`Боюсь у тебя не достаточно балов \u{1F614}`);
    logger.error(error.message || error);
  }
}

module.exports = { spendPoints };
