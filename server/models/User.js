const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minLength: [6, "Full name must be at least 6 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters long"],
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
