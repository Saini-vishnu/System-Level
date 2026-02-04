import express from 'express';
import verifyToken from '../middleware/auth.js';
import SystemData from '../models/SystemData.js';

const router = express.Router();

// Get user's system data
router.get('/data', verifyToken, async (req, res) => {
  try {
    const systemData = await SystemData.findOne({ userId: req.userId });
    
    if (!systemData) {
      return res.status(404).json({ success: false, message: 'DATA NOT FOUND' });
    }

    res.json({
      success: true,
      data: systemData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'FETCH FAILED', error: error.message });
  }
});

// Update system data (sync)
router.post('/data/sync', verifyToken, async (req, res) => {
  try {
    const { state } = req.body;

    let systemData = await SystemData.findOne({ userId: req.userId });

    if (!systemData) {
      systemData = new SystemData({ userId: req.userId, ...state });
    } else {
      // Merge/update the state
      Object.assign(systemData, state);
    }

    await systemData.save();

    res.json({
      success: true,
      message: 'DATA SYNCED',
      data: systemData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'SYNC FAILED', error: error.message });
  }
});

// Add log entry
router.post('/data/log', verifyToken, async (req, res) => {
  try {
    const { logEntry } = req.body;

    const systemData = await SystemData.findOne({ userId: req.userId });

    if (!systemData) {
      return res.status(404).json({ success: false, message: 'USER DATA NOT FOUND' });
    }

    systemData.logs.push(logEntry);
    await systemData.save();

    res.json({
      success: true,
      message: 'LOG ADDED',
      data: systemData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'LOG ADD FAILED', error: error.message });
  }
});

// Add violation entry
router.post('/data/violation', verifyToken, async (req, res) => {
  try {
    const { violation } = req.body;

    const systemData = await SystemData.findOne({ userId: req.userId });

    if (!systemData) {
      return res.status(404).json({ success: false, message: 'USER DATA NOT FOUND' });
    }

    systemData.violations.push(violation);
    await systemData.save();

    res.json({
      success: true,
      message: 'VIOLATION LOGGED',
      data: systemData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'VIOLATION LOG FAILED', error: error.message });
  }
});

// Update daily target
router.put('/data/target', verifyToken, async (req, res) => {
  try {
    const { dailyTarget } = req.body;

    const systemData = await SystemData.findOne({ userId: req.userId });

    if (!systemData) {
      return res.status(404).json({ success: false, message: 'USER DATA NOT FOUND' });
    }

    systemData.dailyTarget = dailyTarget;
    await systemData.save();

    res.json({
      success: true,
      message: 'TARGET UPDATED',
      data: systemData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'UPDATE FAILED', error: error.message });
  }
});

// Get user logs
router.get('/data/logs', verifyToken, async (req, res) => {
  try {
    const systemData = await SystemData.findOne({ userId: req.userId });

    if (!systemData) {
      return res.status(404).json({ success: false, message: 'USER DATA NOT FOUND' });
    }

    res.json({
      success: true,
      logs: systemData.logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'FETCH LOGS FAILED', error: error.message });
  }
});

// Get user violations
router.get('/data/violations', verifyToken, async (req, res) => {
  try {
    const systemData = await SystemData.findOne({ userId: req.userId });

    if (!systemData) {
      return res.status(404).json({ success: false, message: 'USER DATA NOT FOUND' });
    }

    res.json({
      success: true,
      violations: systemData.violations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'FETCH VIOLATIONS FAILED', error: error.message });
  }
});

export default router;
