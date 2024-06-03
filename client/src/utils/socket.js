// src/socket.js
import { io } from 'socket.io-client';

let socket;

const getSocket = (token) => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      auth: {
        token,
      },
    });
  } else {
    // If the socket already exists, update its auth token if necessary
    if (socket.auth.token !== token) {
      socket.auth.token = token;
      socket.disconnect();
      socket.connect();
    }
  }
  return socket;
};

export default getSocket;
