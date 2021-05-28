// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'HTTPError') res.status(err.status).json(err.message);
  else res.status(500).json({ message: 'Houston, we have a problem!' });
};
