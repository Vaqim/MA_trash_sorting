const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { clientApi } = require('../controllers/api');
const voucher = require('./voucher');

const { multipurposeController } = require('../controllers');

const client = Router();

client.use('/voucher', voucher);

client.get(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.get(req, res, clientApi)),
);

client.get(
  '/bot/:id',
  asyncHandler(async (req, res) => multipurposeController.get(req, res, clientApi)),
);

client.put(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.put(req, res, clientApi)),
);

module.exports = client;
