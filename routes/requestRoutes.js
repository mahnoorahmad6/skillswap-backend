const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { sendRequest, acceptRequest, rejectRequest } = require("../controllers/requestController");

router.post("/send", authMiddleware, sendRequest);
router.post("/accept", authMiddleware, acceptRequest);
router.post("/reject", authMiddleware, rejectRequest);

module.exports = router;