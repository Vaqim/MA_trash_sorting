const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { multipurposeController } = require('../controllers');

const trashType = Router();
const nestedtrashType = Router({ mergeParams: true });

nestedtrashType.post(
  '/',
  asyncHandler(async (req, res) => multipurposeController.post(req, res)),
);

nestedtrashType.get(
  '/',
  asyncHandler(async (req, res) => multipurposeController.get(req, res)),
);

trashType.get(
  '/',
  asyncHandler(async (req, res) => multipurposeController.get(req, res)),
);

trashType.put(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.put(req, res)),
);

trashType.delete(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.del(req, res)),
);

module.exports = { trashType, nestedtrashType };
