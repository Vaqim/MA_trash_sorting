require('dotenv').config({ path: `${process.env.PWD}/.env` });
const fatal = require('../service/fatal');

const config = {
  port: process.env.PORT || 3000,
  urls: {
    organization: process.env.ORGANIZATION_URL || fatal('No organization url!'),
    clients: process.env.CLIENTS_URL || fatal('No clients url!'),
  },
};

module.exports = config;
