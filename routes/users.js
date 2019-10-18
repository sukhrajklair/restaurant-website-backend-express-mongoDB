const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find()
  .then(users=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users)
  },
  err=>{res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.json({err: err});
  });
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, 
    (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      //new user has been registered
      else {
        //user must be successfully registered before setting its firs and last name
        user.firstname = req.body.firstname || '';
        user.lastname = req.body.lastname || '';
        user.save()
        .then( user=>{
          //login the new user right away
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          });
        }, 
        err => {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        }) 
      }
    }
  );
});

//authenticate the user using local strategy and then send the token in the
//response. Any further requests from the client will need to included the token
router.post('/login', passport.authenticate('local'), (req, res) => {
  //If this function gets called, authentication was successful.
  //`req.user` contains the authenticated user.
  console.log('logging in');
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
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
