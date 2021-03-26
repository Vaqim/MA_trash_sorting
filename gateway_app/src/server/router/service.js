const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { multipurposeController } = require('../controllers');

const services = Router();

services.get(
  '',
  asyncHandler((req, res) => multipurposeController.get(req, res)),
);

services.get(
  '/:id',
  asyncHandler((req, res) => multipurposeController.get(req, res)),
);

services.post(
  '',
  asyncHandler((req, res) => multipurposeController.get(req, res)),
);

services.put(
  '/:id',
  asyncHandler((req, res) => multipurposeController.put(req, res)),
);

services.delete(
  '/:id',
  asyncHandler((req, res) => multipurposeController.del(req, res)),
);

module.exports = services;
