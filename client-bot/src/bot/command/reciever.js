const { Markup } = require('telegraf');
const api = require('../api');
const logger = require('../../logger')(__filename);

async function getAllRecievers(ctx) {
  try {
    const recievers = await api.get(`/recievers`);
    const buttons = recievers.map((rec) => {
      return [
        Markup.button.callback(rec.name, `trash_types ${rec.telegram_id}`),
        Markup.button.callback(`Дізнатися більше`, `get_reciever ${rec.id}`),
      ];
    });

    ctx.reply(`Про кого хочете дізнатися?`, Markup.inlineKeyboard(buttons));
  } catch (error) {
    ctx.reply(`Не можу отримати пункти прийому`);
    logger.error(error.message || error);
  }
}

async function getRecieverById(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];
    const reciever = await api.get(`/recievers/${id}`);

    const button = Markup.button.callback(
      `Яке сміття вони приймають?`,
      `trash_types ${reciever.telegram_id}`,
    );

    ctx.answerCbQuery();
    ctx.reply(
      `${reciever.name}\nАдреса: ${reciever.address}\nТелефон: ${reciever.phone}\n`,
      Markup.inlineKeyboard([button]),
    );
  } catch (error) {
    ctx.reply(`Не можу отримати пункти прийому`);
    logger.error(error.message || error);
  }
}

async function getTrashTypesByRecieverId(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];
    const trashTypes = await api.get(`/recievers/${id}/trash_types`);

    const strings = trashTypes.map((types) => {
      return `${types.name}\nБали за кілограм: ${types.modifier * 100}`;
    });

    ctx.answerCbQuery();
    ctx.reply(strings.join('\n'));
  } catch (error) {
    ctx.reply(`Не можу отримати види сміття`);
    logger.error(error.message || error);
  }
}

module.exports = { getAllRecievers, getRecieverById, getTrashTypesByRecieverId };
