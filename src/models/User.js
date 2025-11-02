const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    loginToken: {
      type: String,
      select: false,
    },
    loginTokenExpires: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ loginTokenExpires: 1 }, { expireAfterSeconds: 0 });

userSchema.methods.generateLoginToken = function () {
  const crypto = require("crypto");
  const token = crypto.randomBytes(32).toString("hex");

  this.loginToken = token
  this.loginTokenExpires = Date.now() + 15 * 60 * 1000; 

  return token;
};

userSchema.methods.verifyLoginToken = function (token) {
  return this.loginToken === token && this.loginTokenExpires > Date.now();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
