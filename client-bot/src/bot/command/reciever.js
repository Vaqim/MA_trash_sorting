const { Markup } = require('telegraf');
const api = require('../api');
const logger = require('../../logger')(__filename);

async function getAllRecievers(ctx) {
  try {
    const recievers = await api.get(`/recievers`);

    const buttons = recievers.map((rec) => {
      return [
        Markup.button.callback(rec.login, `trash_types ${rec.id}`),
        Markup.button.callback(`Узнать больше`, `get_reciever ${rec.id}`),
      ];
    });

    ctx.reply(`О ком хотите узнать?`, Markup.inlineKeyboard(buttons));
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getRecieverById(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];
    const reciever = await api.get(`/recievers/${id}`);

    const button = Markup.button.callback(
      `Какой мусор они принимают?`,
      `trash_types ${reciever.id}`,
    );

    ctx.reply(
      `${reciever.login}\nАдреса: ${reciever.address}\nТелефон: ${reciever.phone}\n`,
      Markup.inlineKeyboard([button]),
    );
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getTrashTypesByRecieverId(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];
    const trashTypes = await api.get(`/recievers/${id}/trash_types`);

    const strings = trashTypes.map((types) => {
      return `${types.name}\nБаллы за килограм: ${types.modifier * 100}`;
    });

    ctx.reply(strings.join('\n'));
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { getAllRecievers, getRecieverById, getTrashTypesByRecieverId };
