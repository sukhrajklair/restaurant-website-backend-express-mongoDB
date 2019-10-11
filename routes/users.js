const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req,res,next){
  User.findOne({username: req.body.username})
  .then(user => {
    if (user !== null){
      const err = new Error('User '+req.body.username + ' already exits');
      err.status = 403;
      next(err);
    }
    else{
      return User.create({
        username: req.body.username,
        password: req.body.password
      });
    }
  })
  .then(user => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({status:'Registration Successfull', 
      user: user
    })
  },
    err => next(err))
  .catch(err => next(err));
})

router.post('/login', (req, res, next)=>{
  if (!req.session.user){
    const authHeader = req.headers.authorization;
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
      User.findOne({username: username})
      .then(user => {
        if ( user === null) {
          const err = new Error('User '+ username + 'does not exist');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 403;
          return next(err);
        }
        else if (user.password !== password) {
          const err = new Error('Your password is incorrect');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 403;
          return next(err);
        }
        else if (user.username === username && user.password === password){
          req.session.user='authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type','text/plain');
          res.end('You are authenticated');
        }
      })  
      .catch(err=>next(err));    
    }
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
