const express = require("express");
const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Send login link to email
 * @access  Public
 */
router.post("/register", authController.register);

/**
 * @route   GET /api/auth/login/:token
 * @desc    Verify login token and authenticate user
 * @access  Public
 */
router.get("/login/:token", authController.loginWithToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", protect, authController.getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", protect, authController.logout);

module.exports = router;
