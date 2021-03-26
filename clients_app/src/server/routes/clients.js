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
);

client.put(
  '/:id',
  aHdlr(async (req, res) => clientsController.editClient(req, res)),
);

client.post(
  '/authenticate',
  aHdlr(async (req, res) => clientsController.authenticate(req, res)),
);

module.exports = client;
