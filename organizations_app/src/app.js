const http = require('http');
const app = require('./server');
const { port, host } = require('./config');
const { prepareServer } = require('./service/server');
const logger = require('./logger')(__filename);

const server = http.createServer(app);

async function boot() {
  await prepareServer(server);
  app.listen(port, host, () => {
    logger.info(`Server is listening on port ${port}`);
  });
}

boot();
