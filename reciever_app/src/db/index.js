const knex = require('knex');
const { db } = require('../config');

const client = knex(db);

class Databse {
  static async testConnection() {
    try {
      await client.raw('SELECT NOW()');
      console.log('Database connection created!');
    } catch (error) {
      console.error(error);
      throw new Error('ERROR: Test connection failed!');
    }
  }

  static async prepareDatabase() {
    console.log('preparing db');
  }
}

module.exports = Databse;
