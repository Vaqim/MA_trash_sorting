const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { authController } = require('../controllers');

const auth = Router();

auth.post(
  '/registration',
  asyncHandler(async (req, res) => authController.registerUser(req, res)),
);

auth.post(
  '/authenticate',
  asyncHandler(async (req, res) => authController.authenticateUser(req, res)),
);

auth.post(
  '/refresh_token',
  asyncHandler(async (req, res) => authController.refreshAccessToken(req, res)),
);

module.exports = auth;
