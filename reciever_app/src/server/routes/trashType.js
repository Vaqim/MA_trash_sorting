const { Router } = require('express');
const aHdlr = require('express-async-handler');

const trashTypeController = require('../controllers/trashType');

const trashType = Router();
const nestedTrashTypes = Router({ mergeParams: true });

trashType.put(
  '/:trash_type_id',
  aHdlr(async (req, res) => trashTypeController.editTrashType(req, res)),
);

trashType.get(
  '/:trash_type_id',
  aHdlr(async (req, res) => trashTypeController.getTrashType(req, res)),
);

nestedTrashTypes.get(
  '/',
  aHdlr(async (req, res) => trashTypeController.getRecieversTrashTypes(req, res)),
);

nestedTrashTypes.get(
  '/:trash_type_id',
  aHdlr(async (req, res) => trashTypeController.getRecieversTrashType(req, res)),
);

nestedTrashTypes.post(
  '/',
  aHdlr(async (req, res) => trashTypeController.createTrashType(req, res)),
);

module.exports = { trashType, nestedTrashTypes };
