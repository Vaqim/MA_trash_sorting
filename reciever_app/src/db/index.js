const knex = require('knex');
const { db } = require('../config');
const HTTPError = require('../utils/httpError');

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
}

module.exports = Databse;
