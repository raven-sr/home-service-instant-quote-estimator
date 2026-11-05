
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Return safe user information
const safe = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// Generate JWT
const token = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// Cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: Number(process.env.COOKIE_EXPIRES_DAYS || 7) * 86400000,
  path: "/",
};

// Set authentication cookie
const setTokenCookie = (res, jwtToken) => {
  res.cookie("token", jwtToken, cookieOptions);
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "homeowner",
    });

    const jwtToken = token(user._id);

    setTokenCookie(res, jwtToken);

    return res.status(201).json({
      success: true,
      user: safe(user),
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: String(email || "").toLowerCase().trim(),
    }).select("+password");

    if (
      !user ||
      !password ||
      !(await user.comparePassword(password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const jwtToken = token(user._id);

    setTokenCookie(res, jwtToken);

    return res.status(200).json({
      success: true,
      user: safe(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// GET CURRENT USER
exports.me = (req, res) => {
  return res.status(200).json({
    success: true,
    user: safe(req.user),
  });
};
