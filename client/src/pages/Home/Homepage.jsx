import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";
import { generateRoomId } from "../../utils/roomId";
import UserDropdown from "../../components/UserDropdown";

const Homepage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState("Recent");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socket = useRef(null);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/users/profile", {
          withCredentials: true,
        });
        setCurrentUser(res.data.user);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users/all", {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Fetch unread message counts for sidebar
  useEffect(() => {
    if (!currentUser) return;
    axios
      .get("http://localhost:8000/chat/unread-counts", {
        withCredentials: true,
      })
      .then((res) => setUnreadCounts(res.data || {}))
      .catch(() => setUnreadCounts({}));
  }, [currentUser, messages]); // update when user/messages change

  // Setup socket connection
  useEffect(() => {
    socket.current = io("http://localhost:8000", {
      withCredentials: true,
      transports: ["websocket"],
      auth: {
        token:
          document.cookie.split("accessToken=")[1]?.split(";")[0] ||
          localStorage.getItem("accessToken") ||
          "",
      },
    });

    socket.current.on("connect", () => {
      if (selectedChat) {
        socket.current.emit("joinRoom", selectedChat);
      }
    });

    socket.current.on("userJoined", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          content: data.message,
          sender: { fullName: "System" },
          createdAt: new Date(),
        },
      ]);
    });

    socket.current.on("newMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          createdAt: new Date(data.createdAt),
        },
      ]);
      // Mark as seen when new message arrives and chat is open
      if (selectedChat) {
        axios.post(
          "http://localhost:8000/chat/seen",
          { roomId: selectedChat },
          { withCredentials: true }
        );
      }
    });

    socket.current.on("error", (data) => {
      console.error("Socket error:", data.message);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [selectedChat]);

  // Handle chat selection (user to chat with)
  const handleChatSelect = (user) => {
    if (!currentUser) return;
    const roomId = generateRoomId(currentUser._id, user._id);
    setSelectedChat(roomId);
    setSelectedUser(user);
    setShowChat(true);
    setSidebarOpen(false);

    // Join the room
    if (socket.current) socket.current.emit("joinRoom", roomId);

    // Fetch chat history and mark as seen
    axios
      .get(`http://localhost:8000/chat/history/${roomId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessages(res.data);
        // Mark as seen after loading messages
        axios.post(
          "http://localhost:8000/chat/seen",
          { roomId },
          { withCredentials: true }
        );
      })
      .catch(() => setMessages([]));
  };

  // Send message to selected chat/room
  const handleSendMessage = () => {
    if (message.trim() !== "" && socket.current && selectedChat) {
      socket.current.emit("sendMessage", { message, room: selectedChat });
      setMessage("");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Render other users (excluding self)
  const filteredUsers = users.filter((user) => user._id !== currentUser?._id);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <div className="bg-slate-700 text-white p-2 sm:p-3 md:p-4 shrink-0">
        <div className="flex items-center justify-between">
          {/* Hamburger Icon: only on small/medium screens */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block xl:hidden p-1"
          >
            <FaBars className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          {/* Spacer div to center items if needed */}
          <div className="flex-1" />
          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white transform transition-transform duration-300 ease-in-out xl:relative xl:translate-x-0 xl:z-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } xl:w-80 2xl:w-96 border-r border-gray-200 flex-col`}
        >
          <div className="xl:hidden flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 text-base sm:text-lg">
              Chats
            </h2>
            <button onClick={() => setSidebarOpen(false)}>
              <FaTimes className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
            </button>
          </div>
          <div className="flex border-b border-gray-200 shrink-0">
            <button
              onClick={() => handleTabChange("Recent")}
              className={`flex-1 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 ${
                activeTab === "Recent"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              } font-medium text-xs sm:text-sm md:text-base`}
            >
              Recent
            </button>
            <button
              onClick={() => handleTabChange("Active")}
              className={`flex-1 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 ${
                activeTab === "Active"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              } text-xs sm:text-sm md:text-base`}
            >
              Active
            </button>
            <button
              onClick={() => handleTabChange("New User")}
              className={`flex-1 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 ${
                activeTab === "New User"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              } text-xs sm:text-sm md:text-base`}
            >
              New User
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.map((user) => {
              const unreadCount = unreadCounts[user._id] || 0;
              return (
                <div
                  key={user._id}
                  onClick={() => handleChatSelect(user)}
                  className={`flex items-center p-2.5 sm:p-3 md:p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                    selectedUser && selectedUser._id === user._id
                      ? "bg-blue-50 border-r-2 border-r-blue-600"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm sm:text-base">
                      {user.avatar || user.fullName[0] || "👤"}
                    </div>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shadow">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="ml-2.5 sm:ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {user.fullName}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Chat Area */}
        <div
          className={`flex-1 flex flex-col ${
            !showChat ? "hidden xl:flex" : "flex"
          }`}
        >
          <div className="bg-white border-b border-gray-200 p-2.5 sm:p-3 md:p-4 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium mr-2 sm:mr-3 text-sm sm:text-base">
                  {selectedUser ? selectedUser.fullName[0] : "🎨"}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg">
                    {selectedUser ? selectedUser.fullName : "Select a user"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {selectedUser ? selectedUser.email : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 md:p-4 space-y-3 sm:space-y-4 md:space-y-6">
            {messages.map((msg, index) => {
              const isMine = msg.sender?._id === currentUser?._id;
              const otherUserId = selectedUser?._id;
              const isSeen =
                isMine &&
                msg.seenBy &&
                Array.isArray(msg.seenBy) &&
                msg.seenBy.includes(otherUserId);
              return (
                <div
                  key={index}
                  className="flex items-start space-x-2 sm:space-x-3"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium shrink-0 text-xs sm:text-sm md:text-base">
                    {msg.sender?.fullName
                      ? msg.sender.fullName[0]
                      : msg.sender === "System"
                      ? "S"
                      : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-blue-600 text-xs sm:text-sm md:text-base">
                        {msg.sender?.fullName ||
                          (msg.sender === "System" ? "System" : "User")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-gray-700 text-xs sm:text-sm md:text-base">
                      {msg.content || msg.message}
                    </div>
                    {isSeen && (
                      <div className="flex items-center mt-1 space-x-1 text-xs text-green-600">
                        <svg
                          className="inline-block w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.5 10.5l3.5 3.5 7-7"
                          />
                        </svg>
                        <span>Seen</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message input */}
          <div className="bg-white border-t border-gray-200 p-2.5 sm:p-3 md:p-4 shrink-0">
            <form
              className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                placeholder="Enter message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border border-gray-300 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm md:text-base"
              />
              <button
                type="submit"
                className="text-blue-500 hover:text-blue-700 focus:outline-none p-2 flex items-center"
                title="Send"
              >
                <FaPaperPlane className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
