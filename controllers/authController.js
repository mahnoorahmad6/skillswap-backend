const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require("../utils/generateToken");
// SIGNUP
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User created!", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("teachSkills learnSkills connections requestsReceived requestsSent");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("teachSkills learnSkills connections requestsReceived requestsSent");;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

     res.status(200).json({
      message: "Logged in successfully",
      token: generateToken(user._id),   
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};