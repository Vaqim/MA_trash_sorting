const db = require('../../db');
const HTTPError = require('../../utils/httpError');
const client = require('../routes/clients');

async function getClient(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw new HTTPError('ID required!', 400);

    const client = await db.getClient(id);

    res.json(client);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    console.error(error);
  }
}

async function createClient(req, res) {
  try {
    if (!req.body.login || !req.body.password)
      throw new HTTPError('Login & Password required!', 400);

    if (req.body.phone && req.body.phone.length > 13)
      throw new HTTPError('Too long phone number', 400);

    const client = await db.createClient(req.body);

    res.status(201).json(client);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    console.error(error);
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
    console.error(error);
  }
}

module.exports = {
  getClient,
  createClient,
  editClient,
};
