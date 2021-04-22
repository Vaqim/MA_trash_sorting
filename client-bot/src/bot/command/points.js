const { Markup } = require('telegraf');
const moment = require('moment');
const api = require('../api');
const logger = require('../../logger')(__filename);

moment.locale('ru');

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

    await api.post(`/points/spend`, { clientId, serviceId });

    const button = Markup.button.callback('Использовать!', `activate ${voucher.id}`);

    ctx.answerCbQuery();
    await ctx.reply(
      `Круто!\nТы потратил ${service.price} на ${
        service.name
      }\nНаслаждайся!\nЭтот купон действителен до\n${moment(voucher.usable_to).format(
        'lll',
      )} \u{270C}`,
      Markup.inlineKeyboard([button]),
    );
  } catch (error) {
    ctx.reply(`Боюсь у тебя не достаточно балов \u{1F614}`);
    logger.error(error.message || error);
  }
}

module.exports = { spendPoints };
