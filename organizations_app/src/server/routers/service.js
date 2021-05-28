const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { serviceController } = require('../controllers');

const services = Router();

services.get(
  '',
  asyncHandler((req, res) => serviceController.getServices(req, res)),
);

services.get(
  '/:id',
  asyncHandler((req, res) => serviceController.getService(req, res)),
);

services.post(
  '',
  asyncHandler((req, res) => serviceController.createService(req, res)),
);

services.put(
  '/:id',
  asyncHandler((req, res) => serviceController.updateService(req, res)),
);

services.delete(
  '/:id',
  asyncHandler((req, res) => serviceController.deleteService(req, res)),
);

module.exports = services;
