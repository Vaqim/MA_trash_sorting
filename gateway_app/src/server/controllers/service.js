const apiAdapter = require('../../service/apiAdapter')

// Microservice URL, used to send requests 
const BASE_URL
const api = apiAdapter(BASE_URL)

async function getServices(req, res) {
  try {
    const services = await api.get(req.path)
    
    res.send(services)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function getService(req, res) {
  try {
    const service = await api.get(req.path)
    
    res.send(service)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function createService(req, res) {
  try {
    const service = await api.post(req.path, req.body)
    
    res.send(service)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function updateService(req, res) {
  try {
    const service = await api.put(req.path, req.body)
    
    res.send(service)
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

async function deleteService(req, res) {
  try {
    await api.delete(req.path)
    
    res.status(202).send()
  } catch (error) {
    console.log(error.message || error)
    throw error
  }
}

module.exports = {getServices, getService, createService, updateService, deleteService}