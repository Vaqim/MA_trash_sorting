const { client } = require('.');
const HTTPError = require('../utils/httpError');
const logger = require('../logger')(__filename);

class ClientDB {
  static async getClient(id) {
    try {
      const user = await client('clients')
        .select(['id', 'login', 'name', 'phone', 'balance'])
        .where({ id });

      if (!user.length) throw new HTTPError('User wasn`t found', 404);

      return user[0];
    } catch (error) {
      logger.warn(error);
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
      logger.warn(error);
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
      logger.warn(error);
      throw new HTTPError('User wasn`t updated', 409);
    }
  }
}

module.exports = ClientDB;
