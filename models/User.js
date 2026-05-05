const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {      type: String,
     
    },
    profilePic: {
      type: String,

    },

    teachSkills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill"
    }
  ],

  learnSkills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill"
    }
  ],
requestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
requestsSent:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
connections:      [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
