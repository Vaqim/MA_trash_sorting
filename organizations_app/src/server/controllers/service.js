const db = require('../../db/models/service')

async function getServices(req, res) {
  try {
    const services = await db.getServices()

    res.json(services)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function getService(req, res) {
  try {
    const { id } = req.params;
    if(!id) throw new Error('Id is not defined!')

    const services = await db.getServiceById(id)

    res.json(services)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function createService(req, res) {
  try {
    const { price, name, organization_id } = req.body
    if(!price || !name || !organization_id) throw new Error('Bad request!')

    const service = await db.createOrganizationService(req.body)

    res.json(service)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function updateService(req, res) {
  try {
    const { id } = req.params
    if(!id) throw new Error('Id is not defined!')
    if(!Object.entries(req.body).length) throw new Error('Nothing to update!')

    const service = await db.updateServiceById(id, req.body)

    res.json(service)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.params
    if(!id) throw new Error('Id is not defined!')

    await db.deleteServiceById(id)

    res.status(202).send()
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

module.exports = {getServices, getService, createService, updateService, deleteService}