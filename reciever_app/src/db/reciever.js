const HTTPError = require('../utils/httpError');
const { client } = require('./index');

class RecieverDB {
  static async getReciever(id) {
    try {
      const user = await client('recievers')
        .select(['id', 'login', 'address', 'phone'])
        .where({ id });

      if (!user.length) throw new HTTPError('Reciever wasn`t found', 404);

      return user[0];
    } catch (error) {
      console.log(error);
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
      console.error(error);
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
      console.error(error);
      throw new HTTPError('Recieve wasn`t updated', 409);
    }
  }
}

module.exports = RecieverDB;
