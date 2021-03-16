const jwt = require('jsonwebtoken');
const { generateError } = require('../../service/error');
const { refreshSecret } = require('../../config');
const { generateAccessToken, generateRefreshToken } = require('../../service/auth');
const { clientsController, organizationController, recieverController } = require('.');

async function registerUser(req, res) {
  try {
    const { userType } = req.body;

    let user;

    switch (userType) {
      case 'client':
        user = await clientsController.createClient(req, res);
        break;
      case 'organization':
        user = await organizationController.createOrganization(req, res);
        break;
      case 'reciever':
        user = await recieverController.createReciever(req, res);
        break;
      default:
        throw generateError('User type is not defined!', 'BadRequestError');
    }

    res.status(201).send(user);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function loginUser(req, res) {
  try {
    const { userType } = req.body;
    let user;
    switch (userType) {
      case 'client':
        // TODO
        break;
      case 'organization':
        user = await organizationController.getOrganizationByParams(req, res);
        break;
      case 'reciever':
        // TODO
        break;
      default:
        throw generateError('User type is not defined!', 'BadRequestError');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error.message || error);
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

module.exports = { registerUser, loginUser, refreshAccessToken };
