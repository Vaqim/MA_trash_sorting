const calc = require('../../service/calculation');
const { generateError } = require('../../service/error');
const { clientApi, organizationApi } = require('./api');
const logger = require('../../logger')(__filename);

async function calculatePoints(req, res) {
  try {
    const { body: trashItems } = req;
    if (!Object.entries(trashItems).length)
      throw generateError('No items to calculate points!', 'BadRequestError');

    const total = calc.calculatePoints(trashItems);

    res.json({ points: total });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function addPoints(req, res) {
  try {
    const { login, pointsAmount } = req.body;
    if (!login || !pointsAmount) throw generateError('Bad request', 'BadRequestError');

    await clientApi.post('/clients/add_points', req.body);

    res.status(202).send();
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function spendPoints(req, res) {
  try {
    const { clientId, serviceId } = req.body;
    if (!clientId || !serviceId) throw generateError('Bad request', 'BadRequestError');

    const { data: service } = await organizationApi.get(`/organization/services/${serviceId}`);

    const { data: client } = await clientApi.get(`/clients/bot/${clientId}`);

    if (client.balance - service.price < 0) throw generateError('Not enough points on balance!');

    await clientApi.post(`/clients/spend_points`, { clientId: client.id, price: service.price });

    res.status(202).send();
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

module.exports = { calculatePoints, addPoints, spendPoints };
