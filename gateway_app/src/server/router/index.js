const auth = require('./auth');
const clients = require('./clients');
const organization = require('./organization');
const points = require('./points');
const recievers = require('./reciever');
const { trashType } = require('./trashType');

module.exports = { auth, clients, organization, points, recievers, trashType };
