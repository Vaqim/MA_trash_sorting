const express = require('express');
const morngan = require('morgan');
const bodyParser = require('body-parser');

const errorHandler = require('./middlewares/errorHandler');
const reciever = require('./routes/reciever');
const { trashType } = require('./routes/trashType');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morngan('dev'));

app.get('/', (req, res) => {
  res.send('Hello from reciever app!');
});

app.use('/recievers', reciever);
app.use('/trash_types', trashType);

app.use(errorHandler);

module.exports = app;
