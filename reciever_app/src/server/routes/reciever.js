const { Router } = require('express');
const aHdlr = require('express-async-handler');

const recieverController = require('../controllers/reciever');
const trashTypeRouter = require('./trashType');

const reciever = Router();

reciever.get(
  '/',
  aHdlr(async (req, res) => recieverController.getReciever(req, res)),
);

reciever.post(
  '/',
  aHdlr(async (req, res) => recieverController.createReciever(req, res)),
);

reciever.put(
  '/',
  aHdlr(async (req, res) => recieverController.editReciever(req, res)),
);

reciever.use('/trash_type', trashTypeRouter);

module.exports = reciever;
