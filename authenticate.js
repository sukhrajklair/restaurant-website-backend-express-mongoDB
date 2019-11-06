const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const FacebookTokenStrategy = require('passport-facebook-token');

const config = require('./config.js');
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

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    })
);

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin){
        next();
    } else {
        err = new Error("You are not authorized to perform this operation!")
        err.status = 403;
        return next(err);
    }
}

/*
exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refereshToken, profile, done)=>{
    User.findOne({facebookId: profile.id})
    .then(user=>{
        if (user){
            return done(null, user);
        }
        else{
            user = new User({
                username: profile.displayName
                });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save()
            .then( user=>done(null,user),
                err => done(err, false)
            );
        }
    },
    err=>done(null, user))
}
))
*/