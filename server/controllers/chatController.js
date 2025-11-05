const User = require("../models/User");
const Chat = require("../models/Chats");

const getChatStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChats = await Chat.countDocuments();
    res.status(200).json({ totalUsers, totalChats });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const sendMessage = async (socket, message, room) => {
  if (!socket.user) return;

  try {
    const newChat = new Chat({
      sender: socket.user.id,
      message,
      room,
    });
    await newChat.save();

    io.to(room).emit("newMessage", {
      sender: socket.user.id,
      message,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Error saving message:", err);
    socket.emit("error", { message: "Failed to send message" });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    if (!roomId) return res.status(400).json({ message: "Room ID required" });

    const messages = await Chat.find({ room: roomId })
      .sort({ createdAt: 1 })
      .populate("sender", "fullName email avatar");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const markMessagesAsSeen = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id;

    if (!roomId) return res.status(400).json({ message: "Room ID required" });

    // Update all messages in the room that haven't been seen by this user
    await Chat.updateMany(
      { room: roomId, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );
    res.status(200).json({ message: "Messages marked as seen" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUnreadCounts = async (req, res) => {
  try {
    const myId = req.user.id;
    // Find all chats sent to current user (not sent by them) that haven't been seen by them
    const unread = await Chat.aggregate([
      {
        $match: {
          // Messages where I'm the recipient (room is DM between me and other user)
          room: { $regex: myId },
          sender: { $ne: myId },
          seenBy: { $ne: myId },
        },
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 },
        },
      },
    ]);
    // Format as: { userId: count }
    const result = {};
    unread.forEach((u) => {
      result[u._id] = u.count;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getChatStats,
  sendMessage,
  getChatHistory,
  markMessagesAsSeen,
  getUnreadCounts,
};
