const apiAdapter = require('../../service/apiAdapter');
const logger = require('../../logger')(__filename);

// Microservice URL, used to send requests
const BASE_URL = 0;
const api = apiAdapter(BASE_URL);

async function getServices(req, res) {
  try {
    const services = await api.get(req.path);

    res.send(services);
  } catch (error) {
    logger.info(error.message || error);
    throw error;
  }
}

async function getService(req, res) {
  try {
    const service = await api.get(req.path);

    res.send(service);
  } catch (error) {
    logger.info(error.message || error);
    throw error;
  }
}

async function createService(req, res) {
  try {
    const service = await api.post(req.path, req.body);

    res.send(service);
  } catch (error) {
    logger.info(error.message || error);
    throw error;
  }
}

async function updateService(req, res) {
  try {
    const service = await api.put(req.path, req.body);

    res.send(service);
  } catch (error) {
    logger.info(error.message || error);
    throw error;
  }
}

async function deleteService(req, res) {
  try {
    await api.delete(req.path);

    res.status(202).send();
  } catch (error) {
    logger.info(error.message || error);
    throw error;
  }
}

module.exports = { getServices, getService, createService, updateService, deleteService };
