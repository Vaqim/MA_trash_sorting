const calc = require('../../service/calculation');
const db = require('../../db/models/points');
const { generateError } = require('../../service/error');
const logger = require('../../logger')(__filename);

async function calculatePoints(req, res) {
  try {
    const { body: trashItems } = req;
    if (!Object.entries(trashItems).length)
      throw generateError('No items to calculate points!', 'BadRequestError');

    const total = calc.calculatePoints(trashItems);

    res.json({ points: total });
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function addPoints(req, res) {
  try {
    const { clientId, pointsAmounts } = req.body;
    if (!clientId || !pointsAmounts) throw generateError('Bad request', 'BadRequestError');

    await db.addPoints(req.body);

    res.status(202).send();
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function spendPoints(req, res) {
  try {
    const { clientId, serviceId } = req.body;
    if (!clientId || !serviceId) throw generateError('Bad request', 'BadRequestError');

    await db.spendPoints(req.body);

    res.status(202).send();
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { calculatePoints, addPoints, spendPoints };
