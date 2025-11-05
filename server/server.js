require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/connectDB");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Chat = require("./models/Chats");

const app = express();
const server = http.createServer(app);
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// REST API Routes
app.use("/api", authRoutes);
app.use("/users", userRoutes);
app.use("/chat", chatRoutes);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token =
    socket.handshake.auth.token ||
    socket.handshake.headers.cookie?.split("accessToken=")[1]?.split(";")[0];

  if (!token) {
    console.error("Socket auth failed: No token provided");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("Socket auth failed: Invalid token");
    next(new Error("Invalid token"));
  }
});

// Handle Socket.IO events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("joinRoom", (room) => {
    if (!socket.user) return;
    socket.join(room);
    io.to(room).emit("userJoined", {
      message: `User ${socket.user.id} joined ${room}`,
      userId: socket.user.id,
    });
  });

  // Send message
  socket.on("sendMessage", async ({ message, room }) => {
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
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
