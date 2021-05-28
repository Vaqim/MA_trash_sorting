function errorHandler(err, req, res, next) {
  switch (err.name) {
    case 'BadRequestError':
      res.status(400).send(err.message);
      break;
    case 'AuthorizationError':
      res.status(403).send(err.message);
      break;
    default:
      res.status(500).send(err.message);
      break;
  }
}

module.exports = errorHandler;
