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

module.exports = {
  getReciever,
};
