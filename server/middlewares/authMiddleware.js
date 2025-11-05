const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.accessToken; // Access token from cookies

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Add the user info to the request object (decoded token)
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = protect;
