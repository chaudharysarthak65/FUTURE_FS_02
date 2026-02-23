import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

/*
==================================================
✅ PROPER CORS CONFIGURATION (Production Ready)
==================================================
*/

const allowedOrigins = [
  'http://localhost:5173',
  'https://future-fs-02-bice.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Handle preflight requests properly
app.options('*', cors());

/*
==================================================
MIDDLEWARE
==================================================
*/

app.use(express.json());

/*
==================================================
ROUTES
==================================================
*/

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

/*
==================================================
ERROR HANDLING
==================================================
*/

app.use(notFound);
app.use(errorHandler);

/*
==================================================
SERVER START
==================================================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});