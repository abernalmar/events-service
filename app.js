var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);

//Connection to mongo
const mongoose = require('mongoose');

const DB_URL = "mongodb+srv://eventos:eventos23@events-service.spgszx5.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connection error'));

module.exports = app;
