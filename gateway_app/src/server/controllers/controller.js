const logger = require('../../logger')(__filename);

async function get(req, res, api) {
  try {
    const { data, status } = await api.get(req.originalUrl);

    res.status(status).send(data);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function post(req, res, api) {
  try {
    const { data, status } = await api.post(req.originalUrl, req.body);

    res.status(status).send(data);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function put(req, res, api) {
  try {
    const { data, status } = await api.put(req.originalUrl, req.body);

    res.status(status).send(data);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function del(req, res, api) {
  try {
    await api.delete(req.originalUrl);

    res.status(202).send();
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { get, post, put, del };
