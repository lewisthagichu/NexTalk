const jwt = require('jsonwebtoken');
const { isValidToken } = require('../utils/tokenValidation');

const socketMiddleware = (socket, next) => {
  let token;

  try {
    if (socket.handshake.auth.token) {
      token = socket.handshake.auth.token;

      // Perform token authentication
      if (!isValidToken(token)) {
        throw new Error('Invalid token');
      }

      const { _id, username } = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = _id;
      socket.username = username;
    }

    next();
  } catch (error) {
    console.log(error);

    throw new Error('Not authorized');
  }

  if (!token) {
    throw new Error('Not authorized, no token');
  }
};

module.exports = { socketMiddleware };
