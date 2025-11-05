const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    // Destructure data from the request body
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists with the same email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user object
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate Access and Refresh Tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevent access to the cookie via JavaScript
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 15 * 60 * 1000, // 15 minutes expiration for the access token
    });
    // Set refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Create a new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Respond with the new access token
    res.status(200).json({ accessToken: newAccessToken });
  });
};

module.exports = { registerUser, loginUser, refreshToken };
