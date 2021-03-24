require('dotenv').config({ path: `${process.env.PWD}/.env` });
const fatal = require('../service/fatal');

const config = {
  port: process.env.PORT || 3000,
  db: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME || fatal('No db name'),
      password: process.env.DB_PASSWORD || fatal('No db password'),
      host: process.env.DB_HOST || fatal('No db host'),
      user: process.env.DB_USER || fatal('No db user'),
      port: process.env.DB_PORT || fatal('No db port'),
    },
    pool: {
      min: 2,
      max: 10,
    },
    debug: true,
  },
};

module.exports = config;
