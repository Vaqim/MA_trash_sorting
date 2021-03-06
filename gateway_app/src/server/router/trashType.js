const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { recieverApi } = require('../controllers/api');
const forbiddenRoute = require('../middlewares/forbiddenRoute')('reciever');

const { multipurposeController } = require('../controllers');

const trashType = Router();
const nestedtrashType = Router({ mergeParams: true });

trashType.get(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.get(req, res, recieverApi)),
);

nestedtrashType.get(
  '/',
  asyncHandler(async (req, res) => multipurposeController.get(req, res, recieverApi)),
);

nestedtrashType.get(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.get(req, res, recieverApi)),
);

trashType.use(forbiddenRoute);
nestedtrashType.use(forbiddenRoute);

nestedtrashType.post(
  '/',
  asyncHandler(async (req, res) => multipurposeController.post(req, res, recieverApi)),
);

trashType.put(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.put(req, res, recieverApi)),
);

trashType.delete(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.del(req, res, recieverApi)),
);

module.exports = { trashType, nestedtrashType };
