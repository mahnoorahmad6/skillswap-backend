const User = require("../models/User");

exports.sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id || req.user.id;

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: "User not found" });

    const alreadySent = receiver.requestsReceived?.some(
      (r) => r.toString() === senderId.toString()
    );
    if (alreadySent) return res.status(400).json({ message: "Request already sent" });

    receiver.requestsReceived.push(senderId);
    await receiver.save();

    // ✅ Also update sender's requestsSent
    const sender = await User.findById(senderId);
    sender.requestsSent = sender.requestsSent || [];
    sender.requestsSent.push(receiverId);
    await sender.save();

    // ✅ Return updated sender so Redux stays in sync
    const updatedSender = await User.findById(senderId)
      .populate("teachSkills learnSkills connections requestsReceived requestsSent");

    res.json({ message: "Request sent successfully", user: updatedSender });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId);
    const sender = await User.findById(requestId);

    if (!sender) return res.status(404).json({ message: "User not found" });

    // Add to connections
    user.connections = user.connections || [];
    sender.connections = sender.connections || [];

    if (!user.connections.includes(requestId)) user.connections.push(requestId);
    if (!sender.connections.includes(userId)) sender.connections.push(userId);

    // Remove from requestsReceived
    user.requestsReceived = user.requestsReceived.filter(
      (r) => r.toString() !== requestId.toString()
    );

    await user.save();
    await sender.save();

    const updatedUser = await User.findById(userId)
      .populate("teachSkills learnSkills connections requestsReceived");

    res.json({ message: "Request accepted", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId);

    user.requestsReceived = user.requestsReceived.filter(
      (r) => r.toString() !== requestId.toString()
    );

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("teachSkills learnSkills connections requestsReceived");

    res.json({ message: "Request rejected", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};