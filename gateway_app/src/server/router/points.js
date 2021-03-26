const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { pointsApi } = require('../controllers/api');

const { multipurposeController } = require('../controllers');

const points = Router();

points.post(
  '/calculate',
  asyncHandler((req, res) => multipurposeController.post(req, res, pointsApi)),
);

points.post(
  '/add',
  asyncHandler((req, res) => multipurposeController.post(req, res, pointsApi)),
);

points.post(
  '/spend',
  asyncHandler((req, res) => multipurposeController.post(req, res, pointsApi)),
);

module.exports = points;
