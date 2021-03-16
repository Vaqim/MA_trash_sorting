const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { clientsController } = require('../controllers');

const client = Router();

client.get(
  '/:id',
  asyncHandler(async (req, res) => clientsController.getClient(req, res)),
);

client.put(
  '/:id',
  asyncHandler(async (req, res) => clientsController.editClient(req, res)),
);

module.exports = client;
