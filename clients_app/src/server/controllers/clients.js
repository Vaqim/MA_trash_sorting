const db = require('../../db');

async function getClient(req, res) {
  try {
    const { id } = req.params;
    if (!id) throw new Error('ID required');

    const client = await db.getClient(id);

    res.json(client);
  } catch (error) {
    res.json({ error: error.message }).status(400);
    console.error(error);
    throw error;
  }
}

async function createClient(req, res) {
  try {
    if (!req.body.login && !req.body.password) throw new Error('Login & Password required!');

    const client = await db.createClient(req.body);

    res.json(client);
  } catch (error) {
    res.json({ error: error.message }).status(400);
    console.error(error);
    throw error;
  }
}

module.exports = {
  getClient,
  createClient,
};
