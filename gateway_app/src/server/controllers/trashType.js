const apiAdapter = require('../../service/apiAdapter');

// Microservice URL, used to send requests
const BASE_URL = 0;
const api = apiAdapter(BASE_URL);

async function createTrashType(req, res) {
  try {
    const trashType = await api.post(req.path, req.body);

    res.send(trashType);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function getTrashType(req, res) {
  try {
    const trashType = await api.get(req.path);

    res.send(trashType);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function editTrashType(req, res) {
  try {
    const trashType = await api.get(req.path, req.body);

    res.send(trashType);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function deleteTrashType(req, res) {
  try {
    await api.delete(req.path);

    res.status(202).send();
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

module.exports = {
  createTrashType,
  getTrashType,
  editTrashType,
  deleteTrashType,
};
