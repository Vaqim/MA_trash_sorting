const { Router } = require('express');
const aHdlr = require('express-async-handler');

const clientsController = require('../controllers/clients');

const client = Router();

client.get(
  '/:id',
  aHdlr(async (req, res) => clientsController.getClient(req, res)),
);

client.post(
  '/',
  aHdlr(async (req, res) => clientsController.createClient(req, res)),
); // create client
client.patch('/:id'); // edit client

client.get('/'); // get all clients

module.exports = client;
