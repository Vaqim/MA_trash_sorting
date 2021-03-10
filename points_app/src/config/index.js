require('dotenv').config({ path: `${process.env.PWD}/.env` })

const config = {
  port: process.env.PORT || 3000,
  db: {
    client: 'postgresql',
    connection: {
      name: process.env.DB_NAME || '',
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || '',
      user: process.env.DB_USER || '',
      port: process.env.DB_PORT || '',
    },
    pool: {
      min: 2,
      max: 10,
    },
    debug: true
  }
}

module.exports = config;