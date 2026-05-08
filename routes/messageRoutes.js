const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Message = require('../models/Message');

// Get chat history between two users
router.get('/:roomId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;