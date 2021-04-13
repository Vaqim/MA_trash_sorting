const { Markup } = require('telegraf');
const api = require('../api');
const logger = require('../../logger')(__filename);

// Variant 1
async function getAllOrganizations(ctx) {
  try {
    const organizations = await api.get(`/organization`);

    const buttons = organizations.map((org) => {
      return [
        Markup.button.callback(org.name, `services ${org.id}`),
        Markup.button.callback(`Узнать больше`, `get_organization ${org.id}`),
      ];
    });

    ctx.reply('Выберете организацию', Markup.inlineKeyboard(buttons));
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

// Variant 2 need to change id
/* async function getAllOrganizations(ctx) {
  try {
    const organizations = await api.get(`/organization`);

    const strings = organizations.map(
      (org) =>
        `${org.name}\nАдреса: ${org.address}\nНомер тедевону: ${org.phone}\nОтримати всi сервiси: \n/service_${org.id}`,
    );

    ctx.reply(strings.join('\n'));
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
} */

async function getOrganizationById(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const id = data.split(' ')[1];
    const organization = await api.get(`/organization/${id}`);

    const button = Markup.button.callback('Что я могу купить?', `services ${organization.id}`);

    ctx.answerCbQuery();
    ctx.reply(
      `${organization.name}\nАдреса: ${organization.address}\nТелефон: ${organization.phone}`,
      Markup.inlineKeyboard([button]),
    );
  } catch (error) {
    logger.error(error.message || error);
    throw error;
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
    ctx.reply('Теперь выбирете сервис, который хотите получить:', Markup.inlineKeyboard(buttons));
  } catch (error) {
    logger.error(error.message || error);
    throw error;
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
      `${service.name}\nЦена: ${service.price}\nОписание: ${service.description}\n`,
      Markup.inlineKeyboard([button]),
    );
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { getAllOrganizations, getOrganizationById, getServicesByOrgId, getServiceById };
