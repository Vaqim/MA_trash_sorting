const jwt = require('jsonwebtoken');
const { accessSecret, refreshSecret } = require('../config');

function generateAccessToken(user) {
  return jwt.sign(user, accessSecret, { expiresIn: '1h' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, refreshSecret);
}

module.exports = { generateAccessToken, generateRefreshToken };
