const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/shorten', authMiddleware.protect, urlController.createShortUrl);

router.get('/my-urls', authMiddleware.protect, urlController.getUserUrls);

router.get('/stats', authMiddleware.protect, urlController.getUrlStats);

router.patch('/:id/toggle', authMiddleware.protect, urlController.toggleUrl);

router.patch('/:id/activate', authMiddleware.protect, urlController.activateUrl);
router.patch('/:id/deactivate', authMiddleware.protect, urlController.deactivateUrl);

router.delete('/:id', authMiddleware.protect, urlController.deleteUrl);

router.get('/:shortCode', urlController.redirectToOriginalUrl);

module.exports = router;
