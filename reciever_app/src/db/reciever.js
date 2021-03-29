const HTTPError = require('../utils/httpError');
const { client } = require('./index');
const logger = require('../logger')(__filename);

class RecieverDB {
  static async getReciever(id) {
    try {
      const user = await client('recievers')
        .select(['id', 'login', 'address', 'phone'])
        .where({ id });

      if (!user.length) throw new HTTPError('Reciever wasn`t found', 404);

      return user[0];
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }

  static async getRecievers() {
    try {
      const users = await client('recievers').select(['id', 'login', 'address', 'phone']);

      if (!users.length) throw new HTTPError('Recievers wasn`t found', 404);

      return users;
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }

  static async createReciever(userData) {
    try {
      const reciever = await client('recievers')
        .insert(userData)
        .returning(['id', 'login', 'address', 'phone']);

      return reciever[0];
    } catch (error) {
      logger.warn(error);
      throw new HTTPError('Recieve wasn`t created', 409);
    }
  }

  static async editReciever(id, userData) {
    try {
      const reciever = await client('recievers')
        .where({ id })
        .update(userData, ['id', 'login', 'address', 'phone']);

      return reciever[0];
    } catch (error) {
      logger.warn(error);
      throw new HTTPError('Recieve wasn`t updated', 409);
    }
  }

  static async authenticate(login, password) {
    try {
      const user = await client('recievers')
        .select(['id', 'login', 'address', 'phone'])
        .where({ login, password });

      if (!user.length) throw new HTTPError('Recievers wasn`t found', 404);

      return user[0];
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }
}

module.exports = RecieverDB;