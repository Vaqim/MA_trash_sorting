const logger = require('../../logger')(__filename);

async function get(req, res, api, path = null) {
  try {
    const data = await api.get(path || req.path);

    res.send(data);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function post(req, res, api, path = null) {
  try {
    const tempPath = path || req.path;
    logger.debug(tempPath, 'tempPath');
    const data = await api.post(tempPath, req.body);

    res.send(data);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function put(req, res, api, path = null) {
  try {
    const data = await api.put(path || req.path, req.body);

    res.send(data);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function del(req, res, api, path = null) {
  try {
    await api.delete(path || req.path);

    res.status(202).send();
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

module.exports = { get, post, put, del };
