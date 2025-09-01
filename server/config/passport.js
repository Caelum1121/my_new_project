const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const keys = require('./keys');
const { EMAIL_PROVIDER } = require('../constants');

const User = mongoose.model('User');
const secret = keys.jwt.secret;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extract JWT from auth header
opts.secretOrKey = secret; // Secret key for JWT

// Configure JWT strategy for passport
passport.use(
  new JwtStrategy(opts, (payload, done) => {
    User.findById(payload.id)
      .then(user => {
        if (user) {
          return done(null, user); // User found
        }

        return done(null, false); // User not found
      })
      .catch(err => {
        return done(err, false); // Error occurred
      });
  })
);

// Initialize passport middleware
module.exports = async app => {
  app.use(passport.initialize());
};
