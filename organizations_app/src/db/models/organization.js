const { knex } = require('../index');
const logger = require('../../logger')(__filename);

async function getOrganizations() {
  try {
    const res = await knex.select('*').from('organizations');

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function createOrganization(data) {
  try {
    const [res] = await knex('organizations').insert(data).returning('*');

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getOrganizationById(id) {
  try {
    const [res] = await knex('organizations').where({ id });

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getOrganizationByParams(data) {
  try {
    const [res] = await knex('organizations').where(data);

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function updateOrganizationById(id, data) {
  try {
    const [res] = await knex('organizations').update(data).where({ id }).returning('*');

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganizationById,
  getOrganizationByParams,
};
