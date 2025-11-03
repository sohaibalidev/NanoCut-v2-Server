/**
 * NanoCut Configuration
 * --------------------------
 * Centralized configuration loaded from environment variables.
 */

require('dotenv').config({ quiet: true });

const APP_NAME = process.env.APP_NAME || 'NanoCut';
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

module.exports = {
  // App Info
  APP_NAME,
  PORT: process.env.PORT || 3000,
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DB_NAME: process.env.DB_NAME || 'nanocut',
  MONGODB_URI: process.env.MONGODB_URI,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'nanocut_secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '30d',

  // Email (for login links and notifications)
  // EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  // EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  // EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  // EMAIL_FROM: `${APP_NAME} <${process.env.EMAIL_USERNAME}>`,

  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: 587,
  SMTP_SECURE: false,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: `${APP_NAME} <${process.env.EMAIL_USERNAME}>`,

  // Security
  MAX_AGE: parseInt(process.env.MAX_AGE, 10) || THIRTY_DAYS,
};
