const { Router } = require('express');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const { clientApi } = require('../controllers/api');

const { multipurposeController } = require('../controllers');
const { botToken } = require('../../config');

const voucher = Router();

voucher.get(
  '/:id',
  asyncHandler(async (req, res) => multipurposeController.get(req, res, clientApi)),
);

voucher.post(
  '',
  asyncHandler(async (req, res) => multipurposeController.post(req, res, clientApi)),
);

voucher.get(
  '/:id/activate',
  asyncHandler(async (req, res) => {
    try {
      const { chat_id, message_id } = req.query;
      await multipurposeController.get(req, res, clientApi);
      await axios.get(
        `https://api.telegram.org/bot${botToken}/editMessageText?chat_id=${chat_id}&message_id=${message_id}&text=${encodeURI(
          'Купон використаний!',
        )}`,
      );
    } catch (error) {
      const { chat_id } = req.query;
      await axios.get(
        `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chat_id}&text=${encodeURI(
          'Купон вже був активований або вже не дійсний!',
        )}`,
      );
      res.status(406).send();
    }
  }),
);

module.exports = voucher;
