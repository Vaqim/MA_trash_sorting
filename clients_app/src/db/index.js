const knex = require('knex');
const { db } = require('../config');
const HTTPError = require('../utils/httpError');
const logger = require('../logger')(__filename);

const client = knex(db);

class Database {
  static async testConnection() {
    try {
      await client.raw('SELECT NOW()');
      logger.info('Database connection created!');
    } catch (error) {
      logger.error(error, error.message);
      throw new Error('ERROR: Test connection failed!');
    }
  }

  static async getClient(id) {
    try {
      const user = await client('clients')
        .select(['id', 'login', 'name', 'phone', 'balance'])
        .where({ id });

      if (!user.length) throw new HTTPError('User wasn`t found', 404);

      return user[0];
    } catch (error) {
      logger.warn(error, error.message);
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
      logger.warn(error, error.message);
      throw new HTTPError('User wasn`t created', 409);
    }
  }

  static async editClient(id, userData) {
    try {
      const user = await client('clients')
        .where({ id })
        .update(userData, ['id', 'login', 'name', 'phone', 'balance']);

      return user[0];
    } catch (error) {
      logger.warn(error, error.message);
      throw new HTTPError('User wasn`t updated', 409);
    }
  }
}

module.exports = Database;
