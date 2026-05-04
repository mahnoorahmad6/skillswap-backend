const User = require("../models/User");
const Skill = require("../models/Skill");

// ADD TEACH SKILL
const addTeachSkill = async (req, res) => {
  try {
    const { skillName } = req.body;
    const userId = req.user._id;

    let skill = await Skill.findOne({ name: skillName });

    if (!skill) {
      skill = await Skill.create({ name: skillName });
    }

    const user = await User.findById(userId);

    if (!user.teachSkills.includes(skill._id)) {
      user.teachSkills.push(skill._id);
      await user.save();
    }

    const updatedUser = await User.findById(userId)
      .populate("teachSkills learnSkills");

    res.json({ user: updatedUser });

  } catch (err) {console.error("ERROR NAME:", err.name);
  console.error("ERROR MESSAGE:", err.message);
  console.error("FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



const addLearnSkill = async (req, res) => {
  try {
    const { skillName } = req.body;
    const userId = req.user._id;

    let skill = await Skill.findOne({ name: skillName });

    if (!skill) {
      skill = await Skill.create({ name: skillName });
    }

    const user = await User.findById(userId);

    if (!user.learnSkills.includes(skill._id)) {
      user.learnSkills.push(skill._id);
      await user.save();
    }

    const updatedUser = await User.findById(userId)
      .populate("teachSkills learnSkills");

    res.json({ user: updatedUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const removeTeachSkill = async (req, res) => {
  try {
    const { skillId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    // remove skill reference
    user.teachSkills = user.teachSkills.filter(
      (id) => id.toString() !== skillId
    );

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("teachSkills learnSkills");

    res.json({ user: updatedUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const removeLearnSkill = async (req, res) => {
  try {
    const { skillId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    user.learnSkills = user.learnSkills.filter(
      (id) => id.toString() !== skillId
    );

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("teachSkills learnSkills");

    res.json({ user: updatedUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addTeachSkill,
  removeTeachSkill,
  addLearnSkill,
  removeLearnSkill
};