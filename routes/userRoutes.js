const express = require('express');
const User = require("../models/User");
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getMatches,getUserById
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get("/matches", protect, getMatches);
router.get("/profile/:id", protect, getUserById);
router.get("/profile/:id", protect, getUserById);

module.exports = router;
