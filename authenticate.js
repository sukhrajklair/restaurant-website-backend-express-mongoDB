const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

//Stratagies require verify callback
//When passport authenticates a request, it parses the credentials contained
//in the request and invoke the verify callback with those credentials
//purpose of verify callback is to find the user that possesses a set of 
//credentials
//User.authenticate function from passport-local-mongoose provides 
//verification of username and password
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//In order to support login sessions, Passport will serialize and deserialize 
//user instances to and from the session.
//passport-local-mogoose supplies the serializing and deserailizing functions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());