const jwt = require('jsonwebtoken');
const { generateError } = require('../../service/error');
const { refreshSecret } = require('../../config');
const { generateAccessToken, generateRefreshToken } = require('../../service/auth');
const multipurposeController = require('./controller');
const { clientApi, organizationApi, recieverApi } = require('./api');
const logger = require('../../logger')(__filename);

async function registerUser(req, res) {
  try {
    const { userType } = req.body;

    let api;
    let url;

    switch (userType) {
      case 'client':
        api = clientApi;
        url = '/clients';
        break;
      case 'organization':
        api = organizationApi;
        url = '/organization';
        break;
      case 'reciever':
        api = recieverApi;
        url = '/recievers';
        break;
      default:
        throw generateError('User type is not defined!', 'BadRequestError');
    }

    const user = await multipurposeController.post(req, res, api, url);

    res.status(201).send(user);
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

async function authenticateUser(req, res) {
  try {
    const { userType } = req.body;

    let api;
    let url;

    switch (userType) {
      case 'client':
        api = clientApi;
        url = '/clients/authenticate';
        break;
      case 'organization':
        api = organizationApi;
        url = '/organization/authenticate';
        break;
      case 'reciever':
        api = recieverApi;
        url = '/recievers/authenticate';
        break;
      default:
        throw generateError('User type is not defined!', 'BadRequestError');
    }

    const user = await multipurposeController.post(req, res, api, url);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    logger.error(error.message || error);
    throw error;
  }
}

function refreshAccessToken(req, res) {
  const refreshToken = req.body.token;
  if (!refreshToken) throw generateError('Invalid data!', 'BadRequestError');
  jwt.verify(refreshToken, refreshSecret, (err, user) => {
    if (err) throw generateError('Authrozitaion error!', 'AuthrozitaionError');
    const newAccessToken = generateAccessToken({
      login: user.login,
      password: user.password,
      name: user.name,
      phone: user.phone,
    });
    res.json({ accessToken: newAccessToken });
  });
}

module.exports = { registerUser, authenticateUser, refreshAccessToken };
