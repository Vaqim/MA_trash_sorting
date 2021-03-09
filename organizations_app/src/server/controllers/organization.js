const db = require('../../db/models/organization')
const { getServicesByOrganizationId } = require('../../db/models/service')

async function getAllOrganizations(req, res) {
  try {
    const org = await db.getOrganizations()

    res.json(org)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function getOrganization(req, res) {
  try {
    const { id } = req.params
    if(!id) throw new Error('Id is not defined!')

    const org = await db.getOrganizationsById(id)

    res.json(org)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function createOrganization(req, res) {
  try {
    const {name, login, password} = req.body
    if(!name || !login || !password) throw new Error('Bad request!')

    const org = await db.createOrganization(req.body)

    res.json(org)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function updateOrganization(req, res) {
  try {
    const { id } = req.params
    if(!id) throw new Error('Id is not defined!')
    if(!Object.entries(req.body).length) throw new Error('Nothing to update!')
    
    const org = await db.updateOrganizationById(id, req.body)

    res.json(org)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function getServicesByOrganization(req, res) {
  try {
    const { id } = req.params
    if(!id) throw new Error('Id is not defined!')

    const services = await getServicesByOrganizationId(id)

    res.json(services)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

module.exports = {getAllOrganizations, getOrganization, updateOrganization, getServicesByOrganization}