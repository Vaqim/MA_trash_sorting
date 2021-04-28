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

  static async getClientByTelegramId(id) {
    try {
      const user = await client('clients')
        .select(['id', 'login', 'name', 'phone', 'balance'])
        .where({ telegram_id: id });

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
        'password',
        'name',
        'phone',
        'balance',
        'telegram_id',
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

  static async authenticate(login, password) {
    try {
      const user = await client('clients')
        .select(['id', 'login', 'name', 'phone', 'balance'])
        .where({ login, password });

      if (!user.length) throw new HTTPError('User wasn`t found', 404);

      return user[0];
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }

  static async increasePoints(id, pointsAmount) {
    try {
      await client('clients')
        .update({
          balance: client.raw('balance + ??', [pointsAmount]),
        })
        .where({ id });

      return true;
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }

  static async decreasePoints(id, price) {
    try {
      await client('clients')
        .update({ balance: client.raw('balance - ??', [+price]) })
        .where({ id });

      return true;
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }
}

module.exports = ClientDB;
