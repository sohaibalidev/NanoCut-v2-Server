const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');

router.post('/shorten', urlController.createShortUrl);

router.get('/my-urls', urlController.getUserUrls);

router.get('/stats', urlController.getUrlStats);

router.delete('/:id', urlController.deleteUrl);

// router.get('/:shortCode', urlController.redirectToOriginalUrl);

module.exports = router;
