const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const points = require('./routers/points');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/points', points);

app.use(errorHandler);

module.exports = app;
