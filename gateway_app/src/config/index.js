require('dotenv').config({ path: `${process.env.PWD}/.env` })

const config = {
  port: process.env.PORT || 3000,
  accessSecret: process.env.ACCESS_TOKEN_SECRET || '',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || ''
}

module.exports = config;