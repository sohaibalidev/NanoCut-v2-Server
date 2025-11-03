const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
exports.generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Set JWT token as HTTP-only cookie
 * @param {object} res - Express response object
 * @param {string} token - JWT token
 */
exports.setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true, 
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  };

  res.cookie('token', token, cookieOptions);
};

/**
 * Clear JWT cookie
 * @param {object} res - Express response object
 */
exports.clearTokenCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};
