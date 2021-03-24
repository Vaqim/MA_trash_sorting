const knex = require('knex');
const { db } = require('../config');
const logger = require('../logger')(__filename);

const client = knex(db);

async function prepareDatabase() {
  console.log('prepare DB');
}

async function testConnection() {
  try {
    await client.raw('SELECT NOW()');
    logger.info('Database connection created!');
    await prepareDatabase();
  } catch (error) {
    logger.error(error);
    throw new Error('ERROR: Test connection failed!');
  }
}

module.exports = {
  client,
  testConnection,
};
