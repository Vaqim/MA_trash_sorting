const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { clientApi } = require('../controllers/api');

const { multipurposeController } = require('../controllers');

const voucher = Router();

voucher.post(
  '',
  asyncHandler(async (req, res) => multipurposeController.post(req, res, clientApi)),
);

voucher.post(
  '/:id/activate',
  asyncHandler(async (req, res) => multipurposeController.post(req, res, clientApi)),
);

module.exports = voucher;
