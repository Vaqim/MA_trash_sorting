const http = require('http');
const app = require('./server');
const { port } = require('./config');
const { prepareServer } = require('./service/server');
const logger = require('./logger')(__filename);

const server = http.createServer(app);

async function boot() {
  await prepareServer(server);
  app.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
  });
}

boot();
