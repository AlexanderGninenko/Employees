const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', require('./routes/users'));
app.use('/api/employees', require('./routes/employees'));

app.use(errorHandler);

module.exports = app;
