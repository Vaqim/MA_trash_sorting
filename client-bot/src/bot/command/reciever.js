const api = require('../api');
const logger = require('../../logger');

async function getAllRecievers(ctx) {
  try {
    const recievers = await api.get(`/recievers`);
    // TODO REPLIES
    ctx.reply(`recievers`);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getRecieverById(ctx) {
  try {
    const recievers = await api.get(`/recievers/${id}`);
    // TODO REPLIES
    ctx.reply(`recievers`);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getTrashTypesByRecieverId(ctx) {
  try {
    const trashTypes = await api.get(`/recievers/${id}/tra`);
    // TODO REPLIES
    ctx.reply(`trashTypes`);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { getAllRecievers, getRecieverById, getTrashTypesByRecieverId };
