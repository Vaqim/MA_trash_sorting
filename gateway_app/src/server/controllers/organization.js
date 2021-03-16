const apiAdapter = require('../../service/apiAdapter');

// Microservice URL, used to send requests
const BASE_URL = 0;
const api = apiAdapter(BASE_URL);

async function getAllOrganizations(req, res) {
  try {
    const organizations = await api.get(req.path);

    res.send(organizations);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function getOrganization(req, res) {
  try {
    const organization = await api.get(req.path);

    res.send(organization);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function getOrganizationByParams(req, res) {
  try {
    const organization = await api.get(req.path, req.body);

    res.send(organization);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function createOrganization(req, res) {
  try {
    const organization = await api.post(req.path, req.body);

    res.send(organization);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function updateOrganization(req, res) {
  try {
    const organization = await api.put(req.path, req.body);

    res.send(organization);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

async function getServicesByOrganization(req, res) {
  try {
    const services = await api.get(req.path);

    res.send(services);
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
}

module.exports = {
  getAllOrganizations,
  createOrganization,
  getOrganization,
  getOrganizationByParams,
  updateOrganization,
  getServicesByOrganization,
};
