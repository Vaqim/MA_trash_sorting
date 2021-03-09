const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const client = require('./routes/clients');

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hi there!');
});

app.use('/client', client);

module.exports = app;
