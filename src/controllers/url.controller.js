const Url = require('../models/Url');
const { generateShortCode, calculateExpirationDate, validateCustomName } = require('../utils/url.js');

exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customName, expiresIn } = req.body;
    const userId = req.user._id;

    if (!validateCustomName(customName)) {
      return res.status(400).json({
        success: false,
        message: 'Custom name must be 3-20 characters and contain only letters, numbers, hyphens, and underscores',
      });
    }

    let shortCode;
    let attempts = 0;

    do {
      shortCode = generateShortCode();
      attempts++;

      const existingUrl = await Url.findOne({ shortCode });
      if (!existingUrl) break;

      if (attempts > 5) {
        return res.status(500).json({
          success: false,
          message: 'Unable to generate unique short code',
        });
      }
    } while (true);

    if (customName) {
      const existingCustomName = await Url.findOne({ customName, userId });
      if (existingCustomName) {
        return res.status(400).json({
          success: false,
          message: 'Custom name already exists for your account',
        });
      }
    }

    const expiresAt = calculateExpirationDate(expiresIn);

    const newUrl = new Url({
      shortCode,
      originalUrl,
      customName: customName || undefined,
      userId,
      expiresAt,
    });

    await newUrl.save();

    res.status(201).json({
      success: true,
      data: {
        id: newUrl._id,
        shortCode: newUrl.shortCode,
        originalUrl: newUrl.originalUrl,
        customName: newUrl.customName,
        expiresAt: newUrl.expiresAt,
        clicks: newUrl.clicks,
        createdAt: newUrl.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating short URL',
      error: error.message,
    });
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const userId = req.user._id;
    const urls = await Url.findByUserId(userId);

    const formattedUrls = urls.map((url) => ({
      id: url._id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      customName: url.customName,
      expiresAt: url.expiresAt,
      clicks: url.clicks,
      createdAt: url.createdAt,
    }));

    res.json({
      success: true,
      data: formattedUrls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching URLs',
      error: error.message,
    });
  }
};

exports.redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    if (url.isExpired) {
      return res.status(410).json({
        success: false,
        message: 'URL has expired',
      });
    }

    await url.incrementClicks();

    res.json({ success: true, url: url.originalUrl });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error redirecting to URL',
      error: error.message,
    });
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const url = await Url.findOne({ _id: id, userId });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    await url.deactivate();

    res.json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting URL',
      error: error.message,
    });
  }
};

exports.getUrlStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalUrls = await Url.countDocuments({ userId, isActive: true });
    const totalClicks = await Url.aggregate([
      { $match: { userId: userId, isActive: true } },
      { $group: { _id: null, total: { $sum: '$clicks' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUrls,
        totalClicks: totalClicks[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message,
    });
  }
};