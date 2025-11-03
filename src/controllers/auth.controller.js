const User = require('../models/User');
const mailer = require('../utils/mailer');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/jwt');

/**
 * Register/Send login link to email
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        email: email.toLowerCase(),
      });
    }

    const loginToken = user.generateLoginToken();
    await user.save({ validateBeforeSave: false });

    try {
      await mailer.sendLoginEmail(email, loginToken);

      res.status(200).json({
        status: 'success',
        message: 'Login link sent to your email',
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);

      if (emailError.message.includes('disabled') || emailError.message.includes('timeout')) {
        res.status(200).json({
          status: 'success',
          message: "Login created successfully. If you don't receive an email, please contact support.",
          debugToken: process.env.NODE_ENV === 'development' ? loginToken : undefined,
        });
      } else {
        throw emailError;
      }
    }
  } catch (error) {
    console.error('Register error:', error);

    if (error.message.includes('Email sending failed')) {
      res.status(500).json({
        status: 'error',
        message: 'Temporary email service issue. Please try again in a few minutes.',
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to process login request',
      });
    }
  }
};

/**
 * Verify login token and authenticate user
 * GET /api/auth/login/:token
 */
exports.loginWithToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token || token.length !== 64) {
      return res.status(400).json({
        status: 'error',
        message: 'Login token is required',
      });
    }

    const user = await User.findOne({
      loginToken: token,
      loginTokenExpires: { $gt: Date.now() },
    }).select('+loginToken +loginTokenExpires');

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired login token',
      });
    }

    user.loginToken = undefined;
    user.loginTokenExpires = undefined;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const jwtToken = generateToken(user._id);

    setTokenCookie(res, jwtToken);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Login with token error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Login failed',
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: 'success',
      user: {
        id: user._id,
        email: user.email,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to get user profile',
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
  clearTokenCookie(res);

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};
