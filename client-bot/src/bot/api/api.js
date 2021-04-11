const axios = require('axios');

// set baseUrl
const baseURL = 'localhost:3000';

const api = axios.create({
  baseURL,
});

module.exports = api;
