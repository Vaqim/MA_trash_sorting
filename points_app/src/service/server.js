const { testConnection } = require('../db');
const logger = require('../logger')(__filename);

function initializeGracefulShutdown(server) {
  function shutdownHandler(error) {
    if (error) logger.info('ERROR: ', error);
    logger.info('\nServer is closing...');
    server.close(() => {
      logger.info('Server closed!');
      process.exit();
    });
  }

  process.on('SIGINT', shutdownHandler);
  process.on('SIGTERM', shutdownHandler);

  process.on('uncaughtException', shutdownHandler);
  process.on('unhandledRejection', shutdownHandler);
}

async function prepareServer(server) {
  try {
    await testConnection();
    initializeGracefulShutdown(server);
  } catch (error) {
    logger.error(`ERROR: ${error.message}`);
    throw error;
  }
}

module.exports = { prepareServer };
