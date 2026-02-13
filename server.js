import express from 'express';

import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/error.middleware.js';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars (EXPLICIT PATH)
dotenv.config({
  path: path.join(__dirname, '.env'),
});

console.log('ACCESS_TOKEN_SECRET =>', process.env.ACCESS_TOKEN_SECRET);

// App init
const app = express();

// Environment
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ==================
// Global Middleware
// ==================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(compression());

// Logger (dev only)
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==================
// Database Connection
// ==================
connectDB();

// ==================
// Routes
// ==================
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running 🚀',
    env: NODE_ENV
  });
});

// Auth / Signup Routes (MVC)
app.use('/api/v1/auth', authRoutes);

// ==================
// Error Handling (ALWAYS LAST)
// ==================
app.use(errorHandler);

// ==================
// Start Server
// ==================
app.listen(PORT, () => {
  console.log(`🔥 Server running in ${NODE_ENV} mode on port ${PORT}`);
});
