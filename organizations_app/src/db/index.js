const knex = require('knex');
const { db } = require('../config');
const logger = require('../logger')(__filename);
/* 
const knex = new Knex(dbConfig);

async function testConnection() {
  try {
    logger.info('Test connection to database...');
    await knex.raw('SELECT NOW()');
  } catch (err) {
    logger.error(err.message || err);
    throw err;
  }
}

async function closeDatabase() {
  logger.info('Stoping database...');
}

module.exports = {
  knex,
  testConnection,
  closeDatabase,
};
*/

async function testConnection() {
  try {
    const { database, ...tempDBConnection } = db.connection;
    const testConnConfig = { client: db.client, connection: tempDBConnection };

    const tempClient = knex(testConnConfig);

    await tempClient.raw('SELECT NOW()');
    logger.info('Database connection created!');

    return tempClient;
  } catch (error) {
    throw new Error('Test connection to Database failed!');
  }
}

async function createDB(tempClient) {
  try {
    await tempClient.raw(`create database ${db.connection.database}`);
    logger.debug('Database created');
    await tempClient.destroy();
  } catch (error) {
    logger.debug('Database already existed');
  }
}

async function prepareDB() {
  try {
    const tempClient = await testConnection();
    await createDB(tempClient);

    const readyClient = knex(db);

    await readyClient.migrate.latest({
      directory: 'src/db/migrations',
    });
  } catch (error) {
    logger.error(error, error.message);
    throw error;
  }
}

module.exports = {
  prepareDB,
  client: knex(db),
};
