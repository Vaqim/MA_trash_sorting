const { Router } = require('express');
const aHdlr = require('express-async-handler');

const vouchersController = require('../controllers/vouchers');

const voucher = Router();

voucher.post(
  '',
  aHdlr(async (req, res) => vouchersController.createVoucher(req, res)),
);

voucher.post(
  '/:id/activate',
  aHdlr(async (req, res) => vouchersController.activateVoucher(req, res)),
);

module.exports = voucher;
