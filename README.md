# PlamMind Chat App

A **real-time 1-to-1 messaging platform** built with **Node.js**, **Express**, **MongoDB**, **Socket.IO**, **React**, and **TailwindCSS**.  
This project demonstrates live chat with authentication, user management, and message delivery status for technical assessment purposes.

---

## Features

- **User Registration & Secure Login (JWT)**
- **1-1 Private Messaging** (live, per-user "seen" status)
- **Socket.IO for Instant Delivery** (message & user join events)
- **Chat History Saved in MongoDB**
- **Unread Message Counters**
- **Profile Update & Delete**
- **Responsive, Modern UI (React + TailwindCSS)**
- **Display Total Users & Chat Count**
- **Clean Modular Codebase**
- **Ready for Local Setup**

---

## Project Structure

```text
PlamMind-ChatBot/
│
├── client/            # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── server/            # Node.js Backend
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   └── ...
│
└── README.md
```

# Installation & Setup

**1. Clone the repository**
git clone https://github.com/jenishkatuwal11/PlamMind-ChatBot.git
cd PlamMind-ChatBot

**2. Backend Setup**
cd server
cp .env.example .env
**Edit .env with your MongoDB URI and secrets**
npm install
npm run dev # or node server.js
API runs by default at http://localhost:8000

**3. Frontend Setup**
cd ../client
npm install
npm run dev
Frontend runs at http://localhost:5173

# Environment Variables

Fill /server/.env as follows (see .env.example):
PORT=8000
DBCONNECTION=mongodb+srv://<username>:<password>@<cluster_url>/
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# API Overview

Authentication: JWT in HTTP-only cookies for login, refresh, and protected routes
Socket.IO: Used for real-time communication and notifications

**User**
| Method | Endpoint | Description |
| ------ | ----------------------- | ------------------------ |
| POST | `/api/register` | Register new user |
| POST | `/api/login` | User login |
| POST | `/api/refresh-token` | Refresh JWT token |
| GET | `/users/profile` | Get current user profile |
| PUT | `/users/profile-update` | Update user profile |
| DELETE | `/users/profile-delete` | Delete user account |
| GET | `/users/all` | Get all users (list) |

**Chat**
| Method | Endpoint | Description |
| ------ | ----------------------- | ------------------------------------- |
| GET | `/chat/history/:roomId` | Fetch chat messages (by roomId) |
| POST | `/chat/seen` | Mark messages as seen in a chat |
| GET | `/chat/unread-counts` | Unread message count per user |
| GET | `/chat/stats` | Get total users and chats (protected) |

**Live Messaging (Socket Events)**
User Join: When a user joins a chat room, all clients are notified instantly.
New Message: All messages sent are delivered and rendered in real time.
Message Seen: "Seen" status is updated live for per-user read receipts.

**Assignment Coverage**
-CRUD User Operations with Auth/Authorization
-Emit & Listen Socket.IO Events
-Save Chat History in MongoDB
-Show Chat/User Counts
-Real-Time Messaging & Seen Status
-Modern UI (React/Tailwind)

# Contact

**Created by Jenish Katuwal**
📧 jenishkatuwal7@gmail.com
