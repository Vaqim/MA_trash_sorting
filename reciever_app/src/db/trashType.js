const HTTPError = require('../utils/httpError');
const { client } = require('./index');
const logger = require('../logger')(__filename);

class TrashTypeDB {
  // eslint-disable-next-line camelcase
  static async createTrashType(trashTypeData, reciever_id) {
    try {
      const trashType = await client('trash_types').insert({ ...trashTypeData, reciever_id }, '*');

      return trashType[0];
    } catch (error) {
      logger.warn(error);
      throw new HTTPError('Trash type wasn`t created', 409);
    }
  }

  static async getTrashType(id) {
    try {
      const trashType = await client('trash_types')
        .select(['*'])
        .where({ id })
        .whereNull('deleted_at');

      if (!Object.keys(trashType).length) throw new HTTPError('Trash type wasn`t found', 404);

      return trashType[0];
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }

  static async editTrashType(trashTypeData, id) {
    try {
      const trashType = await client('trash_types')
        .update(trashTypeData, ['*'])
        .where({ id })
        .returning('*');
      return trashType[0];
    } catch (error) {
      logger.warn(error);
      throw new HTTPError('Trash type wasn`t updated', 409);
    }
  }

  // eslint-disable-next-line camelcase
  static async getRecieversTrashTypes(reciever_id) {
    try {
      const trashTypes = await client('trash_types')
        .select(['*'])
        .where({ reciever_id })
        .whereNull('deleted_at');

      return trashTypes;
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }

  static async deleteTrashType(id) {
    try {
      await client('trash_types').update({ deleted_at: new Date() }).where({ id });

      return true;
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }
}

module.exports = TrashTypeDB;
