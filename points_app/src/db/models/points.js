const { knex } = require('../index');
const logger = require('../../logger');

async function addPoints(data) {
  try {
    const { clientId, pointsAmount } = data;

    await knex('clients')
      .update({ balance: knex.raw('balance + ??', [pointsAmount]) })
      .where({ id: clientId });

    return true;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function spendPoints(data) {
  try {
    const { clientId, serviceId } = data;

    const [service] = await knex.select('price').from('services').where({ id: serviceId });

    const [client] = await knex.select('balance').from('clients').where({ id: clientId });

    if (client.balance - service.price < 0) throw new Error('Not enough points on balance!');

    await knex('clients')
      .update({ balance: knex.raw('balance - ??', [service.price]) })
      .where({ id: clientId });

    return true;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { addPoints, spendPoints };
