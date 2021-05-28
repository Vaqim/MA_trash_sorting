const { Markup } = require('telegraf');
const api = require('../api');
const logger = require('../../logger')(__filename);

async function getAllOrganizations(ctx) {
  try {
    const organizations = await api.get(`/organization`);

    const buttons = organizations.map((org) => {
      return [
        Markup.button.callback(org.name, `services ${org.telegram_id}`),
        Markup.button.callback(`Дізнатися більше`, `get_organization ${org.id}`),
      ];
    });

    ctx.reply('Окей, обери організацію у якої хочеш щось купити', Markup.inlineKeyboard(buttons));
  } catch (error) {
    ctx.reply(`Не можу отримати організацію`);
    logger.error(error.message || error);
  }
}

async function getOrganizationById(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];
    const organization = await api.get(`/organization/${id}`);

    const button = Markup.button.callback(
      'Що я можу купити?',
      `services ${organization.telegram_id}`,
    );

    ctx.answerCbQuery();
    ctx.reply(
      `${organization.name}\nАдреса: ${organization.address}\nТелефон: ${organization.phone}`,
      Markup.inlineKeyboard([button]),
    );
  } catch (error) {
    ctx.reply(`Не можу отримати організацію`);
    logger.error(error.message || error);
  }
}

async function getServicesByOrgId(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];

    const services = await api.get(`/organization/${id}/services`);

    const buttons = services.map((ser) => {
      return [
        Markup.button.callback(`${ser.name}: ${ser.price}`, `buy ${ser.id}`),
        Markup.button.callback(`Дізнатися більше`, `get_service ${ser.id}`),
      ];
    });

    ctx.answerCbQuery();
    ctx.reply('Тепер вибери що хочеш отримати:', Markup.inlineKeyboard(buttons));
  } catch (error) {
    ctx.reply(`Не можу отримати сервіси`);
    logger.error(error.message || error);
  }
}

async function getServiceById(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];

    const service = await api.get(`/organization/services/${id}`);

    const button = Markup.button.callback('Купую!', `buy ${service.id}`);

    ctx.answerCbQuery();
    ctx.reply(
      `${service.name}\nЦiна: ${service.price}\nОпис: ${
        service.description ? service.description : 'Здається тут нічого не написано \u{1F615}'
      }\n`,
      Markup.inlineKeyboard([button]),
    );
  } catch (error) {
    ctx.reply(`Не можу отримати сервіс`);
    logger.error(error.message || error);
  }
}

module.exports = { getAllOrganizations, getOrganizationById, getServicesByOrgId, getServiceById };
