import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dbConnect from './DB/dbConnect.js';
import authRouter from './route/authUser.js';
import messageRouter from './route/messageRoute.js';
import userRouter from './route/userRoute.js';
import debugRouter from './route/debugRoute.js';

dotenv.config(); // Load .env variables
// Load frontend URL from environment (set this in production).
// You can also set `ALLOWED_ORIGINS` as a comma-separated list to allow
// multiple frontend domains (useful for Vercel preview deployments).
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://live-chat-app-ivory.vercel.app';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS && process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())) || [
  FRONTEND_URL,
  // keep common local dev origins
  'http://localhost:5173',
  'http://localhost:3000'
];

// Import app and server created in Socket.js
import { app, server } from './socket/Socket.js';

//  CORS Middleware - allow frontend origin (use env var in production)
app.use(
  cors({
    origin: function(origin, callback) {
      // allow requests with no origin (like curl or server-to-server)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Origin not allowed'), false);
    },
    credentials: true,
  })
);

//  General Middleware
app.use(express.json());
app.use(cookieParser());

//  API Routes
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);
app.use('/api/debug', debugRouter);

//  Default health route
app.get('/', (req, res) => {
  res.send('Server is running');
});

//  Start server after DB connection
const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  try {
    await dbConnect();
    console.log(` Server is running at http://localhost:${PORT}`);
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error);
  }
});
