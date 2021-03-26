const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/tokenAuth');
const { auth, clients, organization, points, recievers, trashType } = require('./router');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/auth', auth);

app.use(authMiddleware);

app.use('/clients', clients);
app.use('/organization', organization);
app.use('/points', points);
app.use('/recievers', recievers);
app.use('/trash_types', trashType);

app.use(errorHandler);

module.exports = app;
