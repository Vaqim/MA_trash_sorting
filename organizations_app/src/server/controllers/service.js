const db = require('../../db/models/service');
const { generateError } = require('../../service/error');
const logger = require('../../logger')(__filename);

async function getServices(req, res) {
  try {
    const services = await db.getServices();

    res.json(services);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function getService(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw generateError('Id is not defined!', 'BadRequestError');

    const services = await db.getServiceById(id);

    res.json(services);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function createService(req, res) {
  try {
    const { price, name, organizationId } = req.body;
    if (!price || !name || !organizationId) throw generateError('Bad request!', 'BadRequestError');

    const service = await db.createOrganizationService(req.body);

    res.json(service);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function updateService(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw generateError('Id is not defined!', 'BadRequestError');
    if (!Object.entries(req.body).length) throw generateError('Nothing to update!');

    const service = await db.updateServiceById(id, req.body);

    res.json(service);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw generateError('Id is not defined!', 'BadRequestError');

    await db.deleteServiceById(id);

    res.status(202).send();
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { getServices, getService, createService, updateService, deleteService };
