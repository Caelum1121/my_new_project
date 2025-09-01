const jwt = require('jsonwebtoken');

// Function to check authentication from request headers
const checkAuth = async req => {
  try {
    // Check if authorization header is present
    if (!req.headers.authorization) {
      return null;
    }

    // Decode the token from the authorization header
    const token =
      (await jwt.decode(req.headers.authorization.split(' ')[1])) ||
      req.headers.authorization;

    // Return null if token is not present
    if (!token) {
      return null;
    }

    return token;
  } catch (error) {
    return null;
  }
};

module.exports = checkAuth;
