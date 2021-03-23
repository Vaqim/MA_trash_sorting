const Knex = require('knex');
const { db: dbConfig } = require('../config');
const logger = require('../logger')(__filename);

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
