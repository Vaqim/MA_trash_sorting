const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const client = require('./routes/clients');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hi there!');
});

app.use('/clients', client);

app.use(errorHandler);

module.exports = app;
