const createError = require('http-errors');
require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var loginRouter = require('./routes/login').router;
var customersRouter = require('./routes/customers');
var ownersRouter = require('./routes/owners');
var courtsRouter = require('./routes/courts');
var reservationsRouter = require('./routes/reservations');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/login', loginRouter);
app.use('/customers', customersRouter);
app.use('/owners', ownersRouter);
app.use('/courts', courtsRouter);
app.use('/reservations', reservationsRouter);

app.use(cors())

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
