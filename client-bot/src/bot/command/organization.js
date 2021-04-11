const api = require('../api');
const logger = require('../../logger');

async function getAllOrgaizations(ctx) {
  try {
    const organizations = await api.get(`/organization`);
    // TODO REPLIES
    ctx.reply(`organizations`);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getOrgaizationById(ctx) {
  try {
    const organizations = await api.get(`/organization/${id}`);
    // TODO REPLIES
    ctx.reply(`organizations`);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getServicesByOrgId(ctx) {
  try {
    const services = await api.get(`/organization/${id}/services`);
    // TODO REPLIES
    ctx.reply(`services`);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getServiceById(ctx) {
  try {
    const services = await api.get(`/organization/services/${id}`);
    // TODO REPLIES
    ctx.reply(`services`);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { getAllOrgaizations, getOrgaizationById, getServicesByOrgId, getServiceById };
