const knex = require('knex');
const { db } = require('../config');
const HTTPError = require('../utils/httpError');

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

      if (!user.length) throw new HTTPError('User wasn`t found', 404);

      return user[0];
    } catch (error) {
      console.error(error.message);
      throw error;
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
      throw new HTTPError('User wasn`t created', 409);
    }
  }
}

module.exports = Database;
