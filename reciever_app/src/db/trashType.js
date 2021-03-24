const HTTPError = require('../utils/httpError');
const { client } = require('./index');
const logger = require('../logger')(__filename);

class TrashTypeDB {
  static async createTrashType(trashTypeData) {
    try {
      const trashType = await client('trash_types').insert(trashTypeData, '*');

      return trashType[0];
    } catch (error) {
      logger.warn(error);
      throw new HTTPError('Trash type wasn`t created', 409);
    }
  }

  static async getTrashType(id) {
    try {
      const trashType = await client('trash_types').select(['*']).where({ id });

      if (!Object.keys(trashType).length) throw new HTTPError('Trash type wasn`t found', 404);

      return trashType[0];
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }

  static async editTrashType(trashTypeData, id) {
    try {
      const trashType = await client('trash_types').update(trashTypeData, ['*']).where({ id });
      return trashType[0];
    } catch (error) {
      logger.warn(error);
      throw new HTTPError('Trash type wasn`t updated', 409);
    }
  }
}

module.exports = TrashTypeDB;
