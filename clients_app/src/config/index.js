require('dotenv').config({ path: './.env' });
const fatal = require('../utils/fatal');

const config = {
  port: 3000,
  host: 'localhost',
  db: {
    client: 'postgres',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || fatal('no db port'),
      user: process.env.DB_USER || fatal('no db user'),
      password: process.env.DB_PASS || fatal('no db pass'),
      database: process.env.DB_NAME || fatal('no db name'),
    },
  },
};

module.exports = config;
