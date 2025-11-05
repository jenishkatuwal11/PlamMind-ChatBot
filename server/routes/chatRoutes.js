const express = require("express");
const {
  getChatStats,
  getChatHistory,
  markMessagesAsSeen,
  getUnreadCounts,
} = require("../controllers/chatController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/stats", protect, getChatStats);
router.get("/history/:roomId", protect, getChatHistory);
router.post("/seen", protect, markMessagesAsSeen);
router.get("/unread-counts", protect, getUnreadCounts);

module.exports = router;
