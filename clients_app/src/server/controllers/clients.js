const generator = require('generate-password');
const db = require('../../db/client');
const HTTPError = require('../../utils/httpError');
const logger = require('../../logger')(__filename);

async function getClient(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw new HTTPError('ID required!', 400);

    const client = await db.getClient(id);

    res.json(client);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function getClientByTelegramId(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw new HTTPError('ID required!', 400);

    const client = await db.getClientByTelegramId(id);

    res.json(client);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function createClient(req, res) {
  try {
    const { body: user } = req;

    if (!user.login || !user.telegram_id)
      throw new HTTPError('Login and telegram id required!', 400);

    if (user.phone && user.phone.length > 13) throw new HTTPError('Too long phone number', 400);

    const password = generator.generate({
      length: 16,
      numbers: true,
    });

    user.password = password;

    const client = await db.createClient(user);

    res.status(201).json(client);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function editClient(req, res) {
  try {
    if (!req.params.id) throw new HTTPError('Client ID required', 400);

    delete req.body.id;

    if (!Object.keys(req.body).length) throw new HTTPError('New client data required', 400);

    const user = await db.editClient(req.params.id, req.body);

    res.json(user);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function authenticate(req, res) {
  try {
    if (!req.body.login || !req.body.password)
      throw new HTTPError('Login & password required!', 400);

    const { login, password } = req.body;

    const client = await db.authenticate(login, password);

    res.json(client);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function increasePoints(req, res) {
  try {
    const { login, pointsAmount } = req.body;

    if (!login || !pointsAmount) throw new HTTPError('Id and amount of points required!', 400);

    await db.increasePoints(login, pointsAmount);

    res.status(202).send();
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function decreasePoints(req, res) {
  try {
    const { clientId, price } = req.body;

    if (!clientId || !price) throw new HTTPError('Id and price required!', 400);

    await db.decreasePoints(clientId, price);

    res.status(202).send();
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

module.exports = {
  getClient,
  getClientByTelegramId,
  authenticate,
  createClient,
  editClient,
  increasePoints,
  decreasePoints,
};
