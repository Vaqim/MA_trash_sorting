const { knex } = require('../index');
const logger = require('../../logger')(__filename);

async function getServices() {
  try {
    const res = await knex.select('*').from('services');

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getServiceById(id) {
  try {
    const [res] = await knex('services').where({ id });

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function createOrganizationService(data) {
  try {
    const [res] = await knex('services').insert(data).returning('*');

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function updateServiceById(id, data) {
  try {
    const [res] = await knex('services').update(data).where({ id }).returning('*');

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function deleteServiceById(id) {
  try {
    const timestamp = new Date();

    await knex('services').update({ deleted_at: timestamp }).where({ id });

    return true;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getServicesByOrganizationId(id) {
  try {
    const res = await knex('services').where({ organization_id: id });

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = {
  getServices,
  getServiceById,
  getServicesByOrganizationId,
  createOrganizationService,
  updateServiceById,
  deleteServiceById,
};
