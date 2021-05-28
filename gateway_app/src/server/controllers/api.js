const apiAdapter = require('../../service/apiAdapter');
const { urls } = require('../../config');

const clientApi = apiAdapter(`http://${urls.client.host}:${urls.client.port}`);
const organizationApi = apiAdapter(`http://${urls.organization.host}:${urls.organization.port}`);
const recieverApi = apiAdapter(`http://${urls.reciever.host}:${urls.reciever.port}`);
const pointsApi = apiAdapter(`http://${urls.points.host}:${urls.points.port}`);

module.exports = { clientApi, organizationApi, recieverApi, pointsApi };
