const db = require('../../db');
const HTTPError = require('../../utils/httpError');

async function getReciever(req, res) {
  try {
    if (!req.params.id) throw new HTTPError('Reciever ID required', 400);

    const reciever = await db.getReciever(req.params.id);

    res.json(reciever);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    console.error(error);
  }
}

async function createReciever(req, res) {
  try {
    if (!req.body.login || !req.body.password || !req.body.address || !req.body.phone)
      throw new HTTPError('Login, password, address & phone required', 400);

    const reciever = await db.createReciever(req.body);

    res.status(201).json(reciever);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    console.error(error);
  }
}

async function editReciever(req, res) {
  try {
    if (!req.params.id) throw new HTTPError('Reciever ID required', 400);

    delete req.body.id;

    if (!Object.keys(req.body).length) throw new HTTPError('New reciever data required', 400);

    const reciever = await db.editReciever(req.params.id, req.body);

    res.json(reciever);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    console.error(error);
  }
}

module.exports = {
  getReciever,
  createReciever,
  editReciever,
};
