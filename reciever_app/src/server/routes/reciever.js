const { Router } = require('express');
const aHdlr = require('express-async-handler');

const recieverController = require('../controllers/reciever');

const reciever = Router();

reciever.get(
  '/:id',
  aHdlr((req, res) => recieverController.getReciever(req, res)),
);

reciever.post(
  '/',
  aHdlr((req, res) => recieverController.createReciever(req, res)),
);

module.exports = reciever;
