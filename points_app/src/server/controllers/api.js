const apiAdapter = require('../../service/apiAdapter');
const { urls } = require('../../config');

const clientApi = apiAdapter(urls.client);
const organizationApi = apiAdapter(urls.organization);

module.exports = { clientApi, organizationApi };
