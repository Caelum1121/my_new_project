// Import the `passport` module for authentication.
const passport = require('passport');

// The `auth` middleware uses Passport to authenticate the user using the JWT strategy.
// The `session: false` option disables session support, so each request must be authenticated separately.
const auth = passport.authenticate('jwt', { session: false });

// Export the `auth` middleware for use in other parts of the application.
module.exports = auth;
