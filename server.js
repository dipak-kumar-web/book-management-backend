import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import userRoutes from './src/routes/v1/user.route.js';
import bookRoutes from './src/routes/v1/book.route.js';
import borrowingRoutes from './src/routes/v1/borrow.route.js';
import connectDB from './src/config/db.js';
import { ratelimiter } from './src/middlewares/rateLimiter.middleware.js';

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Middleware

app.use(ratelimiter);

// CORS configuration for cookies
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Routes
// app.get('/', (req, res) => {
//     console.log('API is running...');
//     res.send('API is running...');
// })
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/borrowings', borrowingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});