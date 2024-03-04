const jwt = require('jsonwebtoken');

// Validate token
const isValidToken = (token) => {
  // Check if the token is present and not expired
  return token && !isTokenExpired(token);
};

const isTokenExpired = (token) => {
  try {
    const decodedToken = jwt.decode(token, { complete: true });

    // Check if the token has an expiration date and if it's still valid. Returns false if the token has no expiration date or is still valid
    return decodedToken && decodedToken.payload.exp * 1000 < Date.now();
  } catch (error) {
    // Handle decoding errors or missing expiration date
    return true;
  }
};

module.exports = { isValidToken, isTokenExpired };
