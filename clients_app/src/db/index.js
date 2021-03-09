const knex = require('knex');
const { db } = require('../config');

const client = knex(db);

class Database {
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

  static async getClient(id) {
    try {
      const user = await client('clients')
        .select(['id', 'login', 'name', 'phone', 'balance'])
        .where({ id });
      return user[0];
    } catch (error) {
      console.error(error);
      throw new Error('Can`t get client');
    }
  }

  static async createClient(clientData) {
    try {
      const user = await client('clients').insert(clientData, [
        'id',
        'login',
        'name',
        'phone',
        'balance',
      ]);

      return user[0];
    } catch (error) {
      console.error(error);
      throw new Error('Can`t create client');
    }
  }
}

module.exports = Database;
