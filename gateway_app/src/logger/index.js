const pino = require('pino');

const options = {
  level: 'trace',
  prettyPrint: { colorize: true, translateTime: true },
};

function logger(filename) {
  return pino(options).child({ filename });
}

module.exports = logger;
