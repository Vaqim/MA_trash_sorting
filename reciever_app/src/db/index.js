const knex = require('knex');
const { db } = require('../config');

const client = knex(db);

async function prepareDatabase() {
  console.log('prepare DB');
}

async function testConnection() {
  try {
    await client.raw('SELECT NOW()');
    console.log('Database connection created!');
    await prepareDatabase();
  } catch (error) {
    console.error(error);
    throw new Error('ERROR: Test connection failed!');
  }
}

module.exports = {
  client,
  testConnection,
};
