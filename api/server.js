const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
const { socketMiddleware } = require('./middleware/socketMiddleware');
const Message = require('./models/messageModel');
const { userJoin, getUsers, userLeave } = require('./utils/connectedUsers');
const { deleteAll } = require('./utils/clearDB');
const connectDB = require('./config/db');

// Connect to the database
connectDB();

const app = express();

// CORS middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  })
);

// Increase limit for JSON payloads
app.use(express.json({ limit: '10mb' }));
// Increase limit for URL-encoded payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/messages', require('./routes/messageRoute'));

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
  // deleteAll(Message);

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
  });

  // Receive new text message from client
  socket.on('newMessage', async ({ roomName, messageData }) => {
    const { text } = messageData;

    // Ensure message is not empty
    if (roomName && text) {
      // Return message to client
      io.to(roomName).emit('message', {
        roomName,

        messageData,
      });
    }
  });

  // Send users to everyone connected
  io.emit('activeUsers', { connectedUsers: getUsers() });

  socket.on('disconnect', () => {
    const user = userLeave(socket.userId);

    if (user) {
      // Send users to everyone connected
      io.emit('activeUsers', { connectedUsers: getUsers() });
    }
  });
});
