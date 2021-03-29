const logger = require('../logger')(__filename);

module.exports = (message) => {
  logger.fatal(`FATAL: ${message}`);
  process.exit(1);
};
