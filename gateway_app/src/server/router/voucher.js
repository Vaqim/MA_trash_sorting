const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { clientApi } = require('../controllers/api');

const { multipurposeController } = require('../controllers');

const voucher = Router();

voucher.get(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.get(req, res, clientApi)),
);

voucher.post(
  '',
  asyncHandler(async (req, res) => multipurposeController.post(req, res, clientApi)),
);

voucher.put(
  '/:id/activate',
  asyncHandler(async (req, res) => multipurposeController.put(req, res, clientApi)),
);

module.exports = voucher;
