import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import SystemData from '../models/SystemData.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'ALL FIELDS REQUIRED' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'USER EXISTS' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create default system data
    const systemData = new SystemData({
      userId: user._id,
      rank: 'E',
      currentExp: 0
    });

    await systemData.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'REGISTRATION APPROVED',
      token,
      userId: user._id,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'REGISTRATION FAILED', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'EMAIL AND PASSWORD REQUIRED' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'INVALID CREDENTIALS' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'INVALID CREDENTIALS' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'LOGIN APPROVED',
      token,
      userId: user._id,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'LOGIN FAILED', error: error.message });
  }
});

export default router;
