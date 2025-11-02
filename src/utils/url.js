const crypto = require('crypto');

exports.generateShortCode = () => {
  return crypto.randomBytes(4).toString('hex');
};

exports.calculateExpirationDate = (days) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + parseInt(days));
  return expirationDate;
};

exports.validateCustomName = (customName) => {
  if (!customName) return true;
  const regex = /^[a-zA-Z0-9_-]+$/;
  return regex.test(customName) && customName.length >= 3 && customName.length <= 20;
};