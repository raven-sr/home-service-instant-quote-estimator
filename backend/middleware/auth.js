
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

async function protect(req, res, next) {
  try {
    // Read JWT from cookie or Authorization header
    const authHeader = req.headers.authorization || "";

    const token =
      req.cookies?.token ||
      (authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing.");
      return res.status(500).json({
        success: false,
        message: "Authentication configuration error.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found.",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });
  }
}

// ==========================================
// ROLE AUTHORIZATION MIDDLEWARE
// ==========================================

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    next();
  };
}

module.exports = {
  protect,
  authorize,
};
