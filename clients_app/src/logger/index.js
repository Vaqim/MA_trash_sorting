const pino = require('pino');

const config = require('../config');

const options = {
  level: config.nodeEnv === 'development' ? 'trace' : 'info',
  prettyPrint: { colorize: true, translateTime: true },
};

function logger(filename) {
  return pino(options).child({ filename });
}

if (config.nodeEnv === 'development') {
  logger(__filename).info(config, 'Current config');
}

module.exports = logger;
