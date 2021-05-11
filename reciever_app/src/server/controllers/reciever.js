const generator = require('generate-password');
const RecieverDB = require('../../db/reciever');
const HTTPError = require('../../utils/httpError');
const logger = require('../../logger')(__filename);

async function getReciever(req, res) {
  try {
    if (!req.params.reciever_id) throw new HTTPError('Reciever ID required', 400);

    const reciever = await RecieverDB.getReciever(req.params.reciever_id);

    res.json(reciever);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function getRecievers(req, res) {
  try {
    const recievers = await RecieverDB.getRecievers();

    res.json(recievers);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function createReciever(req, res) {
  try {
    if (!req.body.login || !req.body.telegram_id || !req.body.address || !req.body.phone)
      throw new HTTPError('Login, address & phone required', 400);

    req.body.password = generator.generate({
      length: 16,
      numbers: true,
    });

    const reciever = await RecieverDB.createReciever(req.body);

    res.status(201).json(reciever);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function editReciever(req, res) {
  try {
    if (!req.params.reciever_id) throw new HTTPError('Reciever ID required', 400);

    if (!Object.keys(req.body).length) throw new HTTPError('New reciever data required', 400);

    const reciever = await RecieverDB.editReciever(req.params.reciever_id, req.body);

    res.json(reciever);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function authenticate(req, res) {
  try {
    if (!req.body.login || !req.body.password)
      throw new HTTPError('Login & password required', 400);

    const { login, password } = req.body;

    const reciever = await RecieverDB.authenticate(login, password);

    res.json(reciever);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function getRecieverByTgId(req, res) {
  try {
    if (!req.params.telegram_id) throw new HTTPError('Reciever Telegram ID required', 400);

    const reciever = await RecieverDB.getRecieverByTgId(req.params.telegram_id);

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
  getRecievers,
  authenticate,
  getRecieverByTgId,
};
