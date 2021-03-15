const jwt = require('jsonwebtoken')

function generateAccessToken(user) {
  return jwt.sign(user, accessSecret, { expiresIn: '30s' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, refreshSecret);
}

module.exports = {generateAccessToken, generateRefreshToken}