const db = require('../../db/vouchers');
const HTTPError = require('../../utils/httpError');
const logger = require('../../logger')(__filename);

async function createVoucher(req, res) {
  try {
    const { service_id: serviceId, client_id: clientId } = req.body;

    if (!serviceId || !clientId) throw new HTTPError('IDs required!', 400);

    const voucher = await db.createVoucher(req.body);

    res.json(voucher);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function getUserVouchers(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) throw new HTTPError('ID required!', 400);

    const vouchers = await db.getUserVouchers(userId);

    res.json(vouchers);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function getVoucherById(req, res) {
  try {
    const { id } = req.params;

    if (!id) throw new HTTPError('ID required!', 400);

    const voucher = await db.getVoucherById(id);

    res.json(voucher);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

async function activateVoucher(req, res) {
  try {
    const { id } = req.params;

    if (!id) throw new HTTPError('ID required!', 400);

    await db.activateVoucher(id);

    res.status(202).send();
  } catch (error) {
    res.status(error.status).json({ error: error.message });
    logger.warn(error);
  }
}

module.exports = { createVoucher, getVoucherById, getUserVouchers, activateVoucher };
