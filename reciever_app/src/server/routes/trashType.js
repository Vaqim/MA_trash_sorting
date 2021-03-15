const { Router } = require('express');
const aHdlr = require('express-async-handler');

const trashTypeController = require('../controllers/trashType');

const trashType = Router();

trashType.post(
  '/',
  aHdlr(async (req, res) => trashTypeController.createTrashType(req, res)),
);

trashType.get(
  '/',
  aHdlr(async (req, res) => trashTypeController.getTrashType(req, res)),
);

trashType.put(
  '/',
  aHdlr(async (req, res) => trashTypeController.editTrashType(req, res)),
);
// trashType.delete('/:id');

module.exports = trashType;
