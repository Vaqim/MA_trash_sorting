const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { pointsController } = require('../controllers');

const points = Router();

points.post(
  '/calculate',
  asyncHandler((req, res) => pointsController.calculatePoints(req, res)),
);

points.post(
  '/add',
  asyncHandler((req, res) => pointsController.addPoints(req, res)),
);

points.post(
  '/spend',
  asyncHandler((req, res) => pointsController.spendPoints(req, res)),
);

module.exports = points;
