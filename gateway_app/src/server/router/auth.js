const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { authController } = require('../controllers');

const auth = Router();

auth.post(
  '/registration',
  asyncHandler(async (req, res) => authController.registerUser(req, res)),
);

auth.post(
  '/login',
  asyncHandler(async (req, res) => authController.loginUser(req, res)),
);

auth.post(
  '/resresh_token',
  asyncHandler(async (req, res) => authController.refreshToken(req, res)),
);

module.exports = auth;
