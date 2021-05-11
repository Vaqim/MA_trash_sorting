const { Markup } = require('telegraf');
const api = require('../api');
const logger = require('../../logger')(__filename);

async function getAllOrganizations(ctx) {
  try {
    const organizations = await api.get(`/organization`);

    const buttons = organizations.map((org) => {
      return [
        Markup.button.callback(org.name, `services ${org.telegram_id}`),
        Markup.button.callback(`Узнать больше`, `get_organization ${org.id}`),
      ];
    });

    ctx.reply(
      'Окей, выбери организацию у которой хочешь что-то купить',
      Markup.inlineKeyboard(buttons),
    );
  } catch (error) {
    ctx.reply(`Не могу получить организации с сервера`);
    logger.error(error.message || error);
  }
}

async function getOrganizationById(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];
    const organization = await api.get(`/organization/${id}`);

    const button = Markup.button.callback(
      'Что я могу купить?',
      `services ${organization.telegram_id}`,
    );

    ctx.answerCbQuery();
    ctx.reply(
      `${organization.name}\nАдреса: ${organization.address}\nТелефон: ${organization.phone}`,
      Markup.inlineKeyboard([button]),
    );
  } catch (error) {
    ctx.reply(`Не могу получить организацию с сервера`);
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
        Markup.button.callback(`Узнать больше`, `get_service ${ser.id}`),
      ];
    });

    ctx.answerCbQuery();
    ctx.reply('Отлично, теперь выбери что хочешь получить:', Markup.inlineKeyboard(buttons));
  } catch (error) {
    ctx.reply(`Не могу получить сервисы`);
    logger.error(error.message || error);
  }
}

async function getServiceById(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];

    const service = await api.get(`/organization/services/${id}`);

    const button = Markup.button.callback('Покупаю!', `buy ${service.id}`);

    ctx.answerCbQuery();
    ctx.reply(
      `${service.name}\nЦена: ${service.price}\nОписание: ${
        service.description ? service.description : 'Кажеться здесь ничего не написано \u{1F615}'
      }\n`,
      Markup.inlineKeyboard([button]),
    );
  } catch (error) {
    ctx.reply(`Не могу получить сервис с сервера`);
    logger.error(error.message || error);
  }
}

module.exports = { getAllOrganizations, getOrganizationById, getServicesByOrgId, getServiceById };
