const TrashTypeDB = require('../../db/trashType');
const HTTPError = require('../../utils/httpError');
const logger = require('../../logger')(__filename);

async function createTrashType(req, res) {
  try {
    if (!req.body.name || !req.body.modifier || !req.params.telegram_id)
      throw new HTTPError('Name, modifier and reciever ID required', 400);

    const trashType = await TrashTypeDB.createTrashType(req.body, req.params.telegram_id);

    logger.debug(trashType, 'Created trash type');

    res.json(trashType);
  } catch (error) {
    logger.warn(error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function getTrashType(req, res) {
  try {
    const trashType = await TrashTypeDB.getTrashType(req.params.trash_type_id);

    res.json(trashType);
  } catch (error) {
    logger.warn(error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function editTrashType(req, res) {
  try {
    if (!req.body) throw new HTTPError('Nothing to update', 400);

    const trashType = await TrashTypeDB.editTrashType(req.body, req.params.trash_type_id);

    res.json(trashType);
  } catch (error) {
    logger.warn(error);
    throw new HTTPError('Trash type wasn`t edited', 409);
  }
}

async function getRecieversTrashTypes(req, res) {
  try {
    if (!req.params.reciever_id) throw new HTTPError('Reciever ID required', 400);

    const trashTypes = await TrashTypeDB.getRecieversTrashTypes(req.params.reciever_id);

    res.json(trashTypes);
  } catch (error) {
    logger.warn(error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function getRecieversTrashType(req, res) {
  try {
    logger.trace(`${req.params.reciever_id}, ${req.params.trash_type_id}`);
    res.json({ message: 'get rec tr type' });
  } catch (error) {
    logger.warn(error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function deleteTrashType(req, res) {
  try {
    if (!req.params.trash_type_id) throw new HTTPError('Trash type ID required', 400);

    const trashTypes = await TrashTypeDB.deleteTrashType(req.params.trash_type_id);

    res.json(trashTypes);
  } catch (error) {
    logger.warn(error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = {
  createTrashType,
  getTrashType,
  editTrashType,
  getRecieversTrashType,
  getRecieversTrashTypes,
  deleteTrashType,
};
