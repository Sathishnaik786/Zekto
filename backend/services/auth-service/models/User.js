const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['customer', 'merchant', 'delivery', 'admin'],
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: {
      type: String,
      index: true
    },
    avatar: String
  },
  deviceInfo: {
    deviceId: String,
    deviceType: String,
    lastLogin: Date
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
