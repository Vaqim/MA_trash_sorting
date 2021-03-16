const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const trashTypeController = require('../controllers');

const trashType = Router();

trashType.post(
  '/',
  asyncHandler(async (req, res) => trashTypeController.createTrashType(req, res)),
);

trashType.get(
  '/',
  asyncHandler(async (req, res) => trashTypeController.getTrashType(req, res)),
);

trashType.put(
  '/',
  asyncHandler(async (req, res) => trashTypeController.editTrashType(req, res)),
);

trashType.delete(
  '/:id',
  asyncHandler(async (req, res) => trashTypeController.deleteTrashType(req, res)),
);

module.exports = trashType;
