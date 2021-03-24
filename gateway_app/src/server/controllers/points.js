const apiAdapter = require('../../service/apiAdapter');
const logger = require('../../logger')(__filename);

// Microservice URL, used to send requests
const BASE_URL = 0;
const api = apiAdapter(BASE_URL);

async function calculatePoints(req, res) {
  try {
    const points = await api.post(req.path, req.body);

    res.send(points);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function addPoints(req, res) {
  try {
    await api.post(req.path, req.body);

    res.status(202).send();
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function spendPoints(req, res) {
  try {
    await api.post(req.path, req.body);

    res.status(202).send();
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { calculatePoints, addPoints, spendPoints };
