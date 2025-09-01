// The `check` function is a middleware generator that takes a list of roles as arguments
// and returns a middleware function to check if the user has one of the specified roles.
const check =
  (...roles) =>
  (req, res, next) => {
    // If the user is not authenticated, return a 401 Unauthorized response.
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    // Check if the user's role is in the list of allowed roles.
    const hasRole = roles.find(role => req.user.role === role);
    // If the user does not have one of the allowed roles, return a 403 Forbidden response.
    if (!hasRole) {
      return res.status(403).send('You are not allowed to make this request.');
    }

    // If the user has one of the allowed roles, proceed to the next middleware or route handler.
    return next();
  };

// Export the `check` function as part of the `role` object.
const role = { check };
module.exports = role;
