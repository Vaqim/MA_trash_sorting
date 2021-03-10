const express = require('express');
const morngan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morngan('dev'));

app.get('/', (req, res) => {
  res.send('Hello from reciever app!');
});

// app.use('/reciever');

module.exports = app;
