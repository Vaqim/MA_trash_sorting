const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const organization = require('./routers/organization');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/organization', organization);

app.use(errorHandler);

module.exports = app;
