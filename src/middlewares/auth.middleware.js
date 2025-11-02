/**
 * Authentication Middleware (Cookie-Based Only)
 * ---------------------------------------------
 * Protects routes using JWT stored in cookies.
 */

const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");

/**
 * Protect middleware — requires valid JWT in cookies.
 */
exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. Please log in.",
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User belonging to this token no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid token." });
    }

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ status: "error", message: "Token expired." });
    }

    return res
      .status(500)
      .json({ status: "error", message: "Authentication failed." });
  }
};

/**
 * OptionalAuth middleware — attaches user if valid cookie exists,
 * but does not block the route if missing or invalid.
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      if (user) req.user = user;
    }
    next();
  } catch {
    next();
  }
};
