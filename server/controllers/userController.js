const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Get current logged-in user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Use the user ID from the decoded JWT token
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Update user details
const updateUser = async (req, res) => {
  const { fullName, email } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    // Save updated user
    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete user account
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user account
    await user.remove();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { fullName: 1, email: 1, avatar: 1 }); // Get all users (exclude password)
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getUser, updateUser, deleteUser, getAllUsers };
