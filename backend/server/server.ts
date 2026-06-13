import dotenv from 'dotenv';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { connectDB } from '../db/db.js';
import router from '../routes/authRoutes.js';
import productRouter from '../routes/productsRoutes.js';
import cartRouter from '../routes/cartRoutes.js';
import orderRouter from '../routes/orderRoutes.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// Connect to MongoDB
connectDB();

// Security Headers
app.use(helmet());

// CORS configuration - strict origin in production, allow wildcard/localhost in dev
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Rate Limiter for sensitive routes
const sensitiveRouteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/login', sensitiveRouteLimiter);
app.use('/api/signup', sensitiveRouteLimiter);
app.use('/api/orders', sensitiveRouteLimiter);

// Register routes
app.use('/api', router);
app.use('/api', productRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);

// Global Error Handler Middleware (prevents stack traces leaking in production)
app.use((err: any, req: Request, res: Response, next: NextFunction): any => {
  console.error('Unhandled Server Error:', err);
  const isProduction = process.env.NODE_ENV === 'production';
  return res.status(err.status || 500).json({
    message: 'An unexpected server error occurred.',
    ...(isProduction ? {} : { detail: err.message || String(err) })
  });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Listening on port ${PORT}`));
