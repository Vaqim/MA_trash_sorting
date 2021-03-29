const apiAdapter = require('../../service/apiAdapter');
const { urls } = require('../../config');
const logger = require('../../logger')(__filename);

logger.debug(urls, `API URLS`);
const clientApi = apiAdapter(`${urls.client.host}:${urls.client.port}`);
const organizationApi = apiAdapter(urls.organization);
const recieverApi = apiAdapter(urls.reciever);
const pointsApi = apiAdapter(urls.points);

module.exports = { clientApi, organizationApi, recieverApi, pointsApi };
