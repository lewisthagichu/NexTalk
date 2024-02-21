const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

// / Middleware to use body data (raw json)
app.use(express.json());
// Middleware to use body data (url encoded)
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use('/register', require('./routes/userRoute'));
app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
