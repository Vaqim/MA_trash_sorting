const { serviceController } = require('../controllers')
const { Router } = require('express'); 
const asyncHandler = require('express-async-handler');

const services = Router()

service.get('', asyncHandler((req, res) => serviceController.getServices(req, res)))

service.get('/:id', asyncHandler((req, res) => serviceController.getService(req, res)))

service.post('', asyncHandler((req, res) => serviceController.createService(req, res)))

service.put('/:id', asyncHandler((req, res) => serviceController.updateService(req, res)))

service.delete('/:id', asyncHandler((req, res) => serviceController.deleteService(req, res)))

module.exports = services