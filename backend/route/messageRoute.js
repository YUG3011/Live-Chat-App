import express from 'express';
import { sendMessage, getMessages } from '../routecontrolers/messageRouteControler.js';
import isLogin from '../middleware/isLogin.js';

const router = express.Router();

// Send a message
router.post('/send/:id', isLogin, sendMessage);

// Get messages by conversation ID
router.get('/:id', isLogin, getMessages); //  ADD THIS LINE

export default router;
