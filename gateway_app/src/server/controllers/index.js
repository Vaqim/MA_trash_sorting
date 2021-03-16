const clientsController = require('./clients');
const organizationController = require('./organization');
const serviceController = require('./service');
const pointsController = require('./points');
const recieverController = require('./reciever');
const trashTypeController = require('./trashType');
const authController = require('./auth');

module.exports = {
  clientsController,
  organizationController,
  serviceController,
  pointsController,
  recieverController,
  trashTypeController,
  authController,
};
