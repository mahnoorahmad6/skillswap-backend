const User = require('../models/User');

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const { bio, profilePic } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id)
      .populate("teachSkills learnSkills");

    const { search } = req.query;

    let users = await User.find({ _id: { $ne: currentUser._id } })
      .populate("teachSkills learnSkills");

    let matches = users.filter((user) => {
      const currentLearnIds = currentUser.learnSkills.map(s => s._id.toString());
      const currentTeachIds = currentUser.teachSkills.map(s => s._id.toString());
      const userTeachIds = user.teachSkills.map(s => s._id.toString());
      const userLearnIds = user.learnSkills.map(s => s._id.toString());

      const mutual =
        currentLearnIds.some(id => userTeachIds.includes(id)) &&
        currentTeachIds.some(id => userLearnIds.includes(id));

      if (!mutual) return false;

      if (search) {
        const q = search.toLowerCase();
        const allSkills = [
          ...user.teachSkills.map(s => s.name),
          ...user.learnSkills.map(s => s.name),
        ];
        return allSkills.some(name => name.toLowerCase().includes(q));
      }

      return true;
    });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// userController.js
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("teachSkills learnSkills");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile, getMatches, getUserById };
