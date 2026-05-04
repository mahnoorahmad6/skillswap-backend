const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addTeachSkill,
  removeTeachSkill,
  addLearnSkill,
  removeLearnSkill
} = require("../controllers/skillController");

router.post("/add-teach-skill", authMiddleware,addTeachSkill);
router.post("/remove-teach-skill", authMiddleware,removeTeachSkill);

router.post("/add-learn-skill", authMiddleware,addLearnSkill);
router.post("/remove-learn-skill", authMiddleware,removeLearnSkill);

module.exports = router;