const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
const { socketMiddleware } = require('./middleware/socketMiddleware');
const { userJoin, getUsers, userLeave } = require('./utils/connectedUsers');
const connectDB = require('./config/db');
const { log } = require('console');

// Connect to the database
connectDB();

const app = express();

// / Middleware to use body data (raw json)
app.use(express.json());

// Middleware to use body data (url encoded)
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  })
);

// Routes
app.use('/api/user', require('./routes/userRoute'));

// Error handler middleware
app.use(errorHandler);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  },
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// Set up middleware for Socket.IO connections
io.use((socket, next) => {
  if (socketMiddleware(socket, next)) {
    next();
  }
});

//  Set up a connection event for SocketIO
io.on('connection', (socket) => {
  const user = userJoin(socket.userId, socket.username);

  // Receive text message from client
  socket.on('textMessage', (message) => {
    console.log(message);
  });

  // Send active users
  io.emit('activeUsers', { users: getUsers() });

  socket.on('disconnect', () => {
    userLeave(socket.userId);
  });
});
