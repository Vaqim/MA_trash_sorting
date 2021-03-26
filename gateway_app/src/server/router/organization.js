const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const services = require('./service');
const { organizationApi } = require('../controllers/api');

const { multipurposeController } = require('../controllers');

const organization = Router();

organization.use('/services', services);

organization.get(
  '',
  asyncHandler((req, res) => multipurposeController.get(req, res, organizationApi)),
);

organization.get(
  '/:id',
  asyncHandler((req, res) => multipurposeController.get(req, res, organizationApi)),
);

organization.put(
  '/:id',
  asyncHandler((req, res) => multipurposeController.put(req, res, organizationApi)),
);

organization.get(
  '/:id/services',
  asyncHandler((req, res) => multipurposeController.get(req, res, organizationApi)),
);

module.exports = organization;
