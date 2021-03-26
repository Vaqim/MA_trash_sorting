class HTTPError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'HTTPError';
    this.status = +status;
  }
}

module.exports = HTTPError;
