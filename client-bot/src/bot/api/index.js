const api = require('./api');
const logger = require('../../logger');

async function get(url) {
  try {
    const { data } = await api.get(url);

    return data;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function post(url, body) {
  try {
    const { data } = await api.post(url, body);

    return data;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function put(url, body) {
  try {
    const { data } = await api.put(url, body);

    return data;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function del(url) {
  try {
    await api.delete(url);

    return true;
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { get, post, put, del };
