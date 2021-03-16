const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const trashTypeRouter = require('./trashType');
const { recieverController } = require('../controllers');

const reciever = Router();

reciever.get(
  '/',
  asyncHandler(async (req, res) => recieverController.getReciever(req, res)),
);

reciever.put(
  '/',
  asyncHandler(async (req, res) => recieverController.editReciever(req, res)),
);

reciever.use('/trash_type', trashTypeRouter);

module.exports = reciever;
