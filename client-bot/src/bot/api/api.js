const axios = require('axios');

const baseURL = 'http://localhost:3000';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Request-Type': 'Bot' },
});

module.exports = api;
