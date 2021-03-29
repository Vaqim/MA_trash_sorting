const apiAdapter = require('../../service/apiAdapter');
const { urls } = require('../../config');

const clientApi = apiAdapter(urls.client);
const organizationApi = apiAdapter(urls.organization);
const recieverApi = apiAdapter(urls.reciever);
const pointsApi = apiAdapter(urls.points);

module.exports = { clientApi, organizationApi, recieverApi, pointsApi };
