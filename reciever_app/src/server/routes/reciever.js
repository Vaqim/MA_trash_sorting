const { Router } = require('express');
const aHdlr = require('express-async-handler');

const recieverController = require('../controllers/reciever');

const reciever = Router();

reciever.get(
  '/:id',
  aHdlr(async (req, res) => recieverController.getReciever(req, res)),
);

reciever.post(
  '/',
  aHdlr(async (req, res) => recieverController.createReciever(req, res)),
);

reciever.put(
  '/:id',
  aHdlr(async (req, res) => recieverController.editReciever(req, res)),
);

module.exports = reciever;
