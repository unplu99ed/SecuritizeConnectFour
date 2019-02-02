// NPM imports
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// code imports
const config = require('./config.js');
const appRouter = require('./src/router/appRouter.js');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const setExpress = async () => {

  appRouter.register(app, config);
  app.listen(config.webServer.port, () => console.log('http://localhost:' + config.webServer.port + '/'))

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}


setExpress();





