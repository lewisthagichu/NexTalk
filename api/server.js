const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const Message = require('./models/messageModel');
const User = require('./models/userModel');
const { deleteAll } = require('./utils/clearDB');
const { errorHandler } = require('./middleware/errorMiddleware');
const { socketMiddleware } = require('./middleware/socketMiddleware');
const { userJoin, getUsers, userLeave } = require('./utils/connectedUsers');
const connectDB = require('./config/db');
const { emitter, createText } = require('./controllers/messageController');

// Connect to the database
connectDB();

const app = express();
app.use('/uploads', express.static(__dirname + '/uploads'));

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
app.use(express.json({ limit: '15mb' }));
// Increase limit for URL-encoded payloads
app.use(express.urlencoded({ limit: '15mb', extended: true }));

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

  // Receive new message from client
  socket.on('newMessage', async ({ formData, textData, messageRoom }) => {
    try {
      let fileData;

      if (textData) {
        const newText = await createText(textData);

        socket.broadcast.to(messageRoom).emit('message', {
          messageRoom,
          newText,
        });

        console.log('message sent');
      }

      emitter.on('fileUploaded', (newFile) => {
        socket.broadcast.to(messageRoom).emit('message', {
          messageRoom,
          newFile,
        });
        console.log('file sent');
      });
    } catch (error) {
      console.log(error);
    }
  });

  // // Receive and transmit notifications
  socket.on('newNotification', ({ messageRoom, data }) => {
    socket.broadcast
      .to(messageRoom)
      .emit('notification', { messageRoom, data });
  });

  // Send online users to everyone connected
  io.emit('onlineUsers', { connectedUsers: getUsers() });

  socket.on('disconnect', () => {
    const user = userLeave(socket.userId);

    if (user) {
      // Send users to everyone connected
      io.emit('activeUsers', { connectedUsers: getUsers() });
    }
  });
});
