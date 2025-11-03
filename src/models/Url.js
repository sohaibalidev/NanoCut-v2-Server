const mongoose = require('mongoose');
const validator = require('validator');

const urlSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: [true, 'Short code is required'],
      unique: true,
      trim: true,
      length: [8, 'Short code must be exactly 8 characters'],
      match: [/^[a-zA-Z0-9]+$/, 'Short code can only contain letters and numbers'],
    },
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      validate: [validator.isURL, 'Please provide a valid URL'],
      trim: true,
    },
    customName: {
      type: String,
      trim: true,
      minlength: [3, 'Custom name must be at least 3 characters long'],
      maxlength: [20, 'Custom name cannot exceed 20 characters'],
      match: [/^[a-zA-Z0-9_-]+$/, 'Custom name can only contain letters, numbers, hyphens and underscores'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
    clicks: {
      type: Number,
      default: 0,
    },
    lastClicked: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

urlSchema.index({ shortCode: 1 }, { unique: true });
urlSchema.index({ userId: 1 });
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
urlSchema.index({ customName: 1 });
urlSchema.index({ createdAt: -1 });

urlSchema.virtual('isExpired').get(function () {
  return this.expiresAt < new Date();
});

urlSchema.methods.incrementClicks = function () {
  this.clicks += 1;
  this.lastClicked = new Date();
  return this.save();
};

urlSchema.methods.deactivate = function () {
  this.isActive = false;
  return this.save();
};

urlSchema.methods.reactivate = function () {
  this.isActive = true;
  const now = new Date();
  const newExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  this.expiresAt = newExpiry;
  return this.save();
};

// NEW: Toggle activation method
urlSchema.methods.toggleActivation = function () {
  this.isActive = !this.isActive;
  if (this.isActive) {
    const now = new Date();
    const newExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    this.expiresAt = newExpiry;
  }
  return this.save();
};

urlSchema.methods.deleteUrl = function () {
  return this.deleteOne();
};

urlSchema.statics.findByShortCode = function (shortCode) {
  return this.findOne({ shortCode });
};

urlSchema.statics.findByUserId = function (userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

urlSchema.statics.findActiveUrls = function () {
  return this.find({
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
};

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
