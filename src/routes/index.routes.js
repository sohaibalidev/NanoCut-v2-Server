const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * Root Router
 *
 * Structure:
 * - /api/auth → Public authentication routes
 * - /api/*   → Protected API modules (require login)
 */

/* Attach User */
router.use(authMiddleware.optionalAuth);

// router.use((req, res, next) => {
//   console.log(req.user);
//   next();
// });

const checkHealth = (_, res) => {
  res.status(200).json({
    status: 'success',
    message: 'NanoCut API is running',
    timestamp: new Date().toISOString(),
  });
};

/* Public routes */
router.use('/auth', require('./auth.routes'));
router.use('/url/', authMiddleware.protect, require('./url.routes'));

router.get('/health', checkHealth);

module.exports = router;
