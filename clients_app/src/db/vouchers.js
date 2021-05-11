/* eslint-disable camelcase */
const { client } = require('.');
const logger = require('../logger')(__filename);
const getNextDay = require('../utils/setNextDay');

class VoucherTable {
  static async createVoucher(data) {
    try {
      const usable_to = getNextDay();

      data.usable_to = usable_to;

      const voucher = await client('vouchers')
        .insert(data, ['client_id', 'service_id', 'usable_to'])
        .returning('*');

      return voucher[0];
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }

  static async getUserVouchers(userId) {
    try {
      const vouchers = await client('vouchers').select('*').where({ client_id: userId });

      return vouchers;
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }

  static async getVoucherById(id) {
    try {
      const voucher = await client('vouchers').select('*').where({ id });

      return voucher;
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }

  static async activateVoucher(id) {
    try {
      await client('vouchers').update({ status: 'activated' }).where({ id });

      return true;
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  }
}

module.exports = VoucherTable;
