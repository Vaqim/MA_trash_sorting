const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const {recieverController} = require('../controllers');

const reciever = Router();

reciever.get('/:id', asyncHandler(async (req, res) => recieverController.getReciever(req, res)),);

reciever.put('/:id', asyncHandler(async (req, res) => recieverController.editReciever(req, res)));

module.exports = reciever;