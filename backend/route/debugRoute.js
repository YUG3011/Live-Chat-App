import express from 'express';
import isLogin from '../middleware/isLogin.js';

const router = express.Router();

// Public health check
router.get('/ping', (req, res) => {
  res.status(200).json({ ok: true, msg: 'pong' });
});

// Protected route to inspect authenticated user (for debugging)
router.get('/whoami', isLogin, (req, res) => {
  res.status(200).json({ ok: true, user: req.user });
});

export default router;
