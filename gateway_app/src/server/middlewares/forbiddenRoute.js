const { generateError } = require('../../service/error');

module.exports = (userType) => {
  return (req, res, next) => {
    if (req.get('request-type') === 'Bot') return next();
    if (req.user.userType !== userType) throw generateError('Forbidden', 'AuthorizationError');
    next();
  };
};
