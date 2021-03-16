const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { organizationController } = require('../controllers');
const services = require('./service');

const organization = Router();

organization.use('/services', services);

organization.get(
  '',
  asyncHandler((req, res) => organizationController.getAllOrganizations(req, res)),
);

organization.get(
  '/login',
  asyncHandler((req, res) => organizationController.getOrganizationByParams(req, res)),
);

organization.post(
  '',
  asyncHandler((req, res) => organizationController.createOrganization(req, res)),
);

organization.get(
  '/:id',
  asyncHandler((req, res) => organizationController.getOrganization(req, res)),
);

organization.put(
  '/:id',
  asyncHandler((req, res) => organizationController.updateOrganization(req, res)),
);

organization.get(
  '/:id/services',
  asyncHandler((req, res) => organizationController.getServicesByOrganization(req, res)),
);

module.exports = organization;
