const jwt = require('jsonwebtoken');
const { accessSecret } = require('../../config');
const { generateError } = require('../../service/error');

function authentificateToken(req, res, next) {
  if (req.get('request-type') === 'Bot') return next();
  const token = req.headers.authorization.split(' ')[1];
  if (!token) throw generateError('Authorization required!', 'AuthorizationError');

  jwt.verify(token, accessSecret, (err, user) => {
    if (err) throw generateError('Token expired!', 'AuthorizationError');

    req.user = user;
    next();
  });
}

module.exports = authentificateToken;
