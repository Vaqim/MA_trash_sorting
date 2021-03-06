const generator = require('generate-password');
const db = require('../../db/models/organization');
const { generateError } = require('../../service/error');
const { getServicesByOrganizationId } = require('../../db/models/service');
const logger = require('../../logger')(__filename);

async function getAllOrganizations(req, res) {
  try {
    const org = await db.getOrganizations();

    res.json(org);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function authenticate(req, res) {
  try {
    const { login, password } = req.body;
    if (!login || !password) throw generateError('Login and password required!', 'BadRequestError');

    const org = await db.getOrganizationByParams(req.body);

    res.json(org);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function getOrganization(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw generateError('Id is not defined!', 'BadRequestError');

    const org = await db.getOrganizationById(id);

    res.json(org);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function getOrgByTgId(req, res) {
  try {
    const { telegram_id } = req.params;
    if (!telegram_id) throw generateError('Telegram id is not defined!', 'BadRequestError');

    const org = await db.getOrgByTgId(telegram_id);

    res.json(org);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function createOrganization(req, res) {
  try {
    const { name, telegram_id, login } = req.body;
    if (!name || !telegram_id || !login) throw generateError('Bad request!', 'BadRequestError');

    const password = generator.generate({
      length: 16,
      numbers: true,
    });

    req.body.password = password;

    const org = await db.createOrganization(req.body);

    res.json(org);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function updateOrganization(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw generateError('Id is not defined!', 'BadRequestError');
    if (!Object.entries(req.body).length) throw generateError('Nothing to update!');

    const org = await db.updateOrganizationById(id, req.body);

    res.json(org);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function getServicesByOrganization(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw generateError('Id is not defined!', 'BadRequestError');

    const services = await getServicesByOrganizationId(id);

    res.json(services);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

module.exports = {
  getAllOrganizations,
  createOrganization,
  getOrganization,
  updateOrganization,
  getServicesByOrganization,
  authenticate,
  getOrgByTgId,
};
