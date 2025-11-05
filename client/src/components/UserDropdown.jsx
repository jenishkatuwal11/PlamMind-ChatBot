import { useEffect, useRef, useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import axios from "../utils/axios";

const UserDropdown = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/profile");
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    // Clear tokens and redirect (cookie removal happens on backend if you add a logout endpoint)
    localStorage.removeItem("accessToken");
    if (onLogout) onLogout();
    window.location.href = "/login";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium text-lg focus:outline-none border-2 border-white shadow"
        onClick={() => setOpen(!open)}
        aria-label="User menu"
      >
        {user?.fullName?.[0]?.toUpperCase() || "U"}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50 py-2 border border-gray-100 animate-fade-in-up">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xl mr-3">
              {user?.fullName?.[0]?.toUpperCase() || <FiUser />}
            </div>
            <div>
              <div className="font-semibold text-gray-800 truncate">
                {user?.fullName || "User"}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.email || ""}
              </div>
            </div>
          </div>
          <button
            className="flex w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition rounded-b-xl text-left"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
