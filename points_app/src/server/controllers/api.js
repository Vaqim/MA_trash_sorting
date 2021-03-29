const apiAdapter = require('../../service/apiAdapter');
const { urls } = require('../../config');

const clientApi = apiAdapter(`http://${urls.client.host}:${urls.client.port}`);
const organizationApi = apiAdapter(`http://${urls.organization.host}:${urls.organization.port}`);

module.exports = { clientApi, organizationApi };
