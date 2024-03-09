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

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
  });

  // Receive new text message from client
  socket.on('newMessage', async (messageData) => {
    // Destructure messageData properties
    const { roomName, sender, recipient, text } = messageData;
    console.log(messageData);

    if (roomName && text) {
      // Create new message in DB
      const messageDoc = await Message.create({ sender, recipient, text });

      // Return message to client
      io.to(roomName).emit('message', messageData);
    }
  });

  // Send users to everyone connected
  io.emit('activeUsers', { users: getUsers() });

  socket.on('disconnect', () => {
    userLeave(socket.userId);
  });
});
