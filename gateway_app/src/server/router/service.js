const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { organizationApi } = require('../controllers/api');

const { multipurposeController } = require('../controllers');

const services = Router();

services.get(
  '',
  asyncHandler((req, res) => multipurposeController.get(req, res, organizationApi)),
);

services.get(
  '/:id',
  asyncHandler((req, res) => multipurposeController.get(req, res, organizationApi)),
);

services.post(
  '',
  asyncHandler((req, res) => multipurposeController.post(req, res, organizationApi)),
);

services.put(
  '/:id',
  asyncHandler((req, res) => multipurposeController.put(req, res, organizationApi)),
);

services.delete(
  '/:id',
  asyncHandler((req, res) => multipurposeController.del(req, res, organizationApi)),
);

module.exports = services;
