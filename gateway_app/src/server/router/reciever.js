const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { recieverApi } = require('../controllers/api');
const forbiddenRoute = require('../middlewares/forbiddenRoute')('reciever');

const { nestedtrashType } = require('./trashType');
const { multipurposeController } = require('../controllers');

const recievers = Router();

recievers.use('/:reciever_id/trash_types', nestedtrashType);

recievers.get(
  '/',
  asyncHandler(async (req, res) => multipurposeController.get(req, res, recieverApi)),
);

recievers.get(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.get(req, res, recieverApi)),
);

recievers.use(forbiddenRoute);

recievers.put(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.put(req, res, recieverApi)),
);

module.exports = recievers;
