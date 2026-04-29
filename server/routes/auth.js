import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { validateRegister, validateLogin } from '../middleware/validator.js';

const router = express.Router();

// Specific rate limit for auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Increased to 100 for testing
  message: 'Too many login attempts, please try again after an hour'
});

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const sendToken = (user, statusCode, res) => {
  console.log('Signing token for user ID:', user._id);
  const token = generateToken(user._id.toString());

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Prevent XSS
    secure: process.env.NODE_ENV === 'production', // Only over HTTPS in production
    sameSite: 'Lax',
    path: '/' // Ensure cookie is available everywhere
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    message: 'Success',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isPremium: user.isPremium
    }
  });
};

// REGISTER
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Registering user:', email);
    console.log('JWT_SECRET Status:', process.env.JWT_SECRET ? '✅ LOADED' : '❌ MISSING');
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Creating new user object...');
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    console.log('User saved to DB:', newUser._id);

    console.log('Generating token...');
    sendToken(newUser, 201, res);
    console.log('Response sent successfully');
  } catch (err) {
    console.error('Registration Error Details:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password'); // Ensure password is included for comparison
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    sendToken(user, 200, res);
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ 
      message: 'Server error during login',
      error: err.message // Temporary: show actual error for debugging
    });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
