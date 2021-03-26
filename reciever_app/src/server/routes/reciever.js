const { Router } = require('express');
const aHdlr = require('express-async-handler');

const recieverController = require('../controllers/reciever');
const { nestedTrashTypes } = require('./trashType');

const reciever = Router();

reciever.use('/:reciever_id/trash_types', nestedTrashTypes);

reciever.post(
  '/',
  aHdlr(async (req, res) => recieverController.createReciever(req, res)),
);

reciever.put(
  '/:reciever_id',
  aHdlr(async (req, res) => recieverController.editReciever(req, res)),
);

reciever.get(
  '/:reciever_id',
  aHdlr(async (req, res) => recieverController.getReciever(req, res)),
);

reciever.get(
  '/',
  aHdlr(async (req, res) => recieverController.getRecievers(req, res)),
);

reciever.post(
  '/authenticate',
  aHdlr(async (req, res) => recieverController.authenticate(req, res)),
);

module.exports = reciever;
