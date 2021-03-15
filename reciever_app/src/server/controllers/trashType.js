const TrashTypeDB = require('../../db/trashType');
const HTTPError = require('../../utils/httpError');

async function createTrashType(req, res) {
  try {
    if (!req.body.name || !req.body.modifier || req.body.reciever_id)
      throw new HTTPError('Name, modifier and reciever ID required', 400);

    const trashTypeData = req.body;

    const trashType = await TrashTypeDB.createTrashType(trashTypeData);

    console.log(trashType);

    res.json(trashType);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function getTrashType(req, res) {
  try {
    if (!req.body.id) throw new HTTPError('Trash type ID required', 400);

    const trashType = await TrashTypeDB.getTrashType(req.body.id);

    res.json(trashType);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function editTrashType(req, res) {
  try {
    const { id } = req.body;
    delete req.body.id;

    if (!req.body) throw new HTTPError('Nothing to update', 400);

    const trashType = await TrashTypeDB.editTrashType(req.body, id);

    res.json(trashType);
  } catch (error) {
    console.error(error);
    throw new HTTPError('Trash type wasn`t edited', 409);
  }
}

module.exports = {
  createTrashType,
  getTrashType,
  editTrashType,
};
