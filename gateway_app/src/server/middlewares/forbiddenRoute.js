const { generateError } = require('../../service/error');

module.exports = (userType) => {
  return (req, res, next) => {
    if (req.user.userType !== userType) throw generateError('Forbidden', 'AuthorizationError');
    next();
  };
};
