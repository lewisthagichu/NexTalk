const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

// / Middleware to use body data (raw json)
app.use(express.json());
// Middleware to use body data (url encoded)
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  })
);

app.use('/api/user', require('./routes/userRoute'));
app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
