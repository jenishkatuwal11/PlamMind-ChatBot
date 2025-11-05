const express = require("express");
const {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// Get the current logged-in user
router.get("/profile", protect, getUser);

// Update user details
router.put("/profile-update", protect, updateUser);

// Delete user account
router.delete("/profile-delete", protect, deleteUser);

router.get("/all", getAllUsers);

module.exports = router;
