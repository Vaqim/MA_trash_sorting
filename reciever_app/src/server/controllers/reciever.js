const RecieverDB = require('../../db/reciever');
const HTTPError = require('../../utils/httpError');
const logger = require('../../logger')(__filename);

async function getReciever(req, res) {
  try {
    if (!req.body.id) throw new HTTPError('Reciever ID required', 400);

    const reciever = await RecieverDB.getReciever(req.body.id);

    res.json(reciever);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function createReciever(req, res) {
  try {
    if (!req.body.login || !req.body.password || !req.body.address || !req.body.phone)
      throw new HTTPError('Login, password, address & phone required', 400);

    const reciever = await RecieverDB.createReciever(req.body);

    res.status(201).json(reciever);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function editReciever(req, res) {
  try {
    if (!req.body.id) throw new HTTPError('Reciever ID required', 400);
    const { id } = req.body;
    delete req.body.id;

    if (!Object.keys(req.body).length) throw new HTTPError('New reciever data required', 400);

    const reciever = await RecieverDB.editReciever(id, req.body);

    res.json(reciever);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

module.exports = {
  getReciever,
  createReciever,
  editReciever,
};
