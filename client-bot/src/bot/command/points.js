const api = require('../api');
const logger = require('../../logger');

async function spendPoints(ctx) {
  try {
    // TODO
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function earnPoints(ctx) {
  try {
    // TODO
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { spendPoints, earnPoints };
