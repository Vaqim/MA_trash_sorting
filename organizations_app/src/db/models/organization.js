const { knex } = require('../index');
const logger = require('../../logger')(__filename);

async function getOrganizations() {
  try {
    const res = await knex
      .select(['id', 'login', 'name', 'phone', 'address'])
      .from('organizations');

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
    const [res] = await knex('organizations')
      .select(['id', 'login', 'name', 'phone', 'address'])
      .where({ id });

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getOrgByTgId(telegram_id) {
  try {
    const [res] = await knex('organizations')
      .select(['id', 'login', 'name', 'phone', 'address'])
      .where({ telegram_id });

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getOrganizationByParams(data) {
  try {
    const [res] = await knex('organizations')
      .select(['id', 'login', 'name', 'phone', 'address'])
      .where(data);

    return res;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function updateOrganizationById(id, data) {
  try {
    const [res] = await knex('organizations')
      .update(data)
      .where({ telegram_id: id })
      .returning(['id', 'login', 'name', 'phone', 'address']);

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
  getOrgByTgId,
};
