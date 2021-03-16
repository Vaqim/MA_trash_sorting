const apiAdapter = require('../../service/apiAdapter');

// Microservice URL, used to send requests
const BASE_URL = 0;
const api = apiAdapter(BASE_URL);

async function getReciever(req, res) {
  try {
    const reciever = await api.get(req.path);

    res.send(reciever);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function createReciever(req, res) {
  try {
    const reciever = await api.post(req.path, req.body);

    res.send(reciever);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function editReciever(req, res) {
  try {
    const reciever = await api.put(req.path, req.body);

    res.send(reciever);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

module.exports = {
  getReciever,
  createReciever,
  editReciever,
};
