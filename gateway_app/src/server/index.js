const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/tokenAuth') 
const {auth, clients, organization, points, reciever} = require('./router')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', auth)

app.use(authMiddleware)

app.use('/client', clients)
app.use('/organization', organization)
app.use('/points', points)
app.use('/reciever', reciever)

app.use(errorHandler)

module.exports = app;