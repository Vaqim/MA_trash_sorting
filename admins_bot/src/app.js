const bot = require('./bot');
const logger = require('./logger')(__filename);

function start() {
  bot.launch();
  logger.info('Admins trash sorting bot has been started');
}

function stop(callback) {
  bot.stop();

  logger.info('Server has been stopped.');
  callback();
}

function enableGracefulExit() {
  const exitHandler = (error) => {
    if (error) logger.error(error);

    logger.debug('Graceful stopping...');
    stop(() => {
      process.exit();
    });
  };
  // ctrl + c
  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);
  // kill pid (nodemon restart)
  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);

  process.on('uncaugthException', exitHandler);
  process.on('unhandledRejection', exitHandler);
}

async function boot() {
  enableGracefulExit();
  start();
}

boot();
