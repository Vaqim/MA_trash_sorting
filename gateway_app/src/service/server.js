function initializeGracefulShutdown(server) {
  function shutdownHandler(error) {
    if (error) console.log('ERROR: ', error);
    console.log('\nServer is closing...');
    server.close(() => {
      console.log('Server closed!');
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
    initializeGracefulShutdown(server);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    throw error;
  }
}

module.exports = { prepareServer };
