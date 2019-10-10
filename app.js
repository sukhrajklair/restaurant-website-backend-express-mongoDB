const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
  console.log('Connected to the server');
},
(err)=>console.log(err)
)

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));

const auth = (req, res, next)=>{
  console.log(req.signedCookies);
  const authHeader = req.headers.authorization;
  if (!req.signedCookies.user){
    //if signed cookie doesn't exist then prompt the user to sign in
    if (!authHeader){
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }
    else{
      //authHeader is a string with two words: Basic and the encoded username+password
      //Firts we are splitting it to on space to extract the encoded username+password
      //Then we are decoding it using Buffer. The base64 string is then converted to 
      // a string. The converted string contains username and password formatted as:
      // "username:password". Therefore we split this string again on ':' to extract 
      //username and password
      const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const username = auth[0];
      const password = auth[1];
      
      if (username === 'admin' && password === 'password'){
        //if the user has signed in then send a cookie to the client so that 
        //it can be included in the next request
        res.cookie('user','admin',{signed:true})
        next();
      }
      else{
        const err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
      }
    }
  }
  else{
    if (req.signedCookies.user === 'admin'){
      next();
    }
    else{
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }
  }
}

app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

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
