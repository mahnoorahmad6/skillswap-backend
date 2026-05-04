const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ ADD THIS
const { getMe } = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", authMiddleware, getMe);

module.exports = router;