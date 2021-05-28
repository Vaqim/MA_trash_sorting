const { Router } = require('express');
const aHdlr = require('express-async-handler');
const voucher = require('./voucher');

const clientsController = require('../controllers/clients');

const client = Router();

client.get(
  '/:id',
  aHdlr(async (req, res) => clientsController.getClient(req, res)),
);

client.get(
  '/bot/:id',
  aHdlr(async (req, res) => clientsController.getClientByTelegramId(req, res)),
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

client.post(
  '/add_points',
  aHdlr(async (req, res) => clientsController.increasePoints(req, res)),
);

client.post(
  '/spend_points',
  aHdlr(async (req, res) => clientsController.decreasePoints(req, res)),
);

client.use('/voucher', voucher);

module.exports = client;
