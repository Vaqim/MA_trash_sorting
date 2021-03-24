const apiAdapter = require('../../service/apiAdapter');
const logger = require('../../logger')(__filename);

// Microservice URL, used to send requests
const BASE_URL = 0;
const api = apiAdapter(BASE_URL);

async function getClient(req, res) {
  try {
    const client = await api.get(req.path);

    res.send(client);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function createClient(req, res) {
  try {
    const client = await api.post(req.path, req.body);

    res.send(client);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function editClient(req, res) {
  try {
    const client = await api.put(req.path, req.body);

    res.send(client);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { getClient, createClient, editClient };
