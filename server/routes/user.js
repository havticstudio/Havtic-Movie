import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT
const auth = async (req, res, next) => {
  try {
    let token;
    
    // Check cookies first (more secure)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // Fallback to header for other clients
    else if (req.header('Authorization')?.startsWith('Bearer ')) {
      token = req.header('Authorization').replace('Bearer ', '');
    }

    if (!token || token === 'none') {
      return res.status(401).json({ message: 'Not authorized to access this resource' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(401).json({ message: 'Token verification failed' });

    req.user = verified.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Session expired or invalid token' });
  }
};

// GET USER DATA (including lists)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD TO WATCHLIST
router.post('/watchlist/add', auth, async (req, res) => {
  try {
    const { item } = req.body;
    const user = await User.findById(req.user);
    
    // Check if already in watchlist
    if (user.watchlist.some(w => w.id === item.id)) {
      return res.status(400).json({ message: 'Already in watchlist' });
    }

    user.watchlist.push(item);
    await user.save();
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE FROM WATCHLIST
router.post('/watchlist/remove', auth, async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(req.user);
    user.watchlist = user.watchlist.filter(w => w.id !== id);
    await user.save();
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD TO COMPLETED
router.post('/completed/add', auth, async (req, res) => {
  try {
    const { item } = req.body;
    const user = await User.findById(req.user);
    
    if (user.completed.some(c => c.id === item.id)) {
      return res.status(400).json({ message: 'Already in completed' });
    }

    user.completed.push(item);
    // Optionally remove from watchlist when marked completed
    user.watchlist = user.watchlist.filter(w => w.id !== item.id);
    
    await user.save();
    res.json({ completed: user.completed, watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE FROM COMPLETED
router.post('/completed/remove', auth, async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(req.user);
    user.completed = user.completed.filter(c => c.id !== id);
    await user.save();
    res.json(user.completed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SUBMIT PAYMENT
router.post('/payment/submit', auth, async (req, res) => {
  try {
    const { amount, transactionId } = req.body;
    if (!transactionId) return res.status(400).json({ message: 'Transaction ID is required' });

    const user = await User.findById(req.user);
    
    // Prevent duplicate trxIds (basic check)
    const exists = user.payments.some(p => p.transactionId === transactionId);
    if (exists) return res.status(400).json({ message: 'This Transaction ID has already been submitted' });

    user.payments.push({ amount, transactionId, status: 'pending' });
    await user.save();
    
    res.json({ message: 'Payment submitted successfully. Please wait for admin approval.', payments: user.payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: GET ALL PENDING PAYMENTS
router.get('/admin/payments', auth, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user);
    if (!adminUser.isAdmin) return res.status(403).json({ message: 'Admin access denied' });

    // Find all users who have pending payments
    const usersWithPayments = await User.find({ 'payments.status': 'pending' }).select('name email payments');
    
    // Flatten and filter only pending ones for the admin view
    const pendingPayments = [];
    usersWithPayments.forEach(u => {
      u.payments.forEach(p => {
        if (p.status === 'pending') {
          pendingPayments.push({
            userId: u._id,
            userName: u.name,
            userEmail: u.email,
            paymentId: p._id,
            amount: p.amount,
            transactionId: p.transactionId,
            createdAt: p.createdAt
          });
        }
      });
    });

    res.json(pendingPayments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: APPROVE PAYMENT & ACTIVATE PREMIUM
router.post('/admin/payment/approve', auth, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user);
    if (!adminUser.isAdmin) return res.status(403).json({ message: 'Admin access denied' });

    const { userId, paymentId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const payment = user.payments.id(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    payment.status = 'approved';
    user.isPremium = true; // Activate premium
    await user.save();

    res.json({ message: 'Payment approved and Premium activated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
