import express from 'express';
import isLogin from '../middleware/isLogin.js';
import Conversation from '../Models/converationModels.js';
import User from '../Models/userModels.js';

const router = express.Router();

// Public health check
router.get('/ping', (req, res) => {
  res.status(200).json({ ok: true, msg: 'pong' });
});

// Protected route to inspect authenticated user (for debugging)
router.get('/whoami', isLogin, (req, res) => {
  res.status(200).json({ ok: true, user: req.user });
});


// Debug: get current chatters for a specific user id (no cookie required)
// Usage: /api/debug/currentchatters?userId=<userId>
router.get('/currentchatters', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ ok: false, msg: 'userId required' });

    const currentChatters = await Conversation.find({ participants: userId }).sort({ updatedAt: -1 });
    if (!currentChatters || currentChatters.length === 0) {
      return res.status(200).json({ ok: true, users: [] });
    }

    const participantIds = currentChatters.reduce((ids, convo) => {
      const others = convo.participants.filter(id => id.toString() !== userId.toString());
      return [...ids, ...others];
    }, []);

    const uniqueParticipantIds = [...new Set(participantIds.map(id => id.toString()))];

    const users = await User.find({ _id: { $in: uniqueParticipantIds } }).select('-password -email');

    res.status(200).json({ ok: true, users });
  } catch (error) {
    console.error('Debug currentchatters error:', error);
    res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

export default router;
