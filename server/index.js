import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import tmdbRoutes from './routes/tmdb.js';
import streamcheckRoutes from './routes/streamcheck.js';

const app = express();
app.set('trust proxy', 1); // Trust Vercel proxy for accurate IP rate limiting
const PORT = process.env.PORT || 5000;

// 1. Security Headers (disable frameguard - needed for iframe embeds)
app.use(helmet({
  frameguard: false,           // Allow iframes for video embeds
  contentSecurityPolicy: false // Allow external embed sources
}));

// 2. Rate Limiting (General)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for development
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// 3. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  /\.vercel\.app$/  // Allow all vercel.app subdomains
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o => 
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    if (allowed) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in production for now
    }
  },
  credentials: true
}));

// 4. Body Parser & Cookie Parser
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DDoS
app.use(cookieParser());

// 5. Data Sanitization against NoSQL injection
// Manual sanitizer to avoid "IncomingMessage query only has a getter" error
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (key.startsWith('$')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});

// 6. Prevent HTTP Parameter Pollution
app.use(hpp());

app.get('/', (req, res) => {
  res.send('Havtic Movie API is running securely...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/stream', streamcheckRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Export the express app for Vercel Serverless Functions
export default app;

// Only listen if not running as a serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    if (process.env.JWT_SECRET) {
      console.log('✅ JWT_SECRET is loaded');
    } else {
      console.error('❌ JWT_SECRET IS MISSING!');
    }
  });
}
