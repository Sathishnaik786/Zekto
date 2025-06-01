const { ValidationError } = require('../../../common/utils/errors');

const validateOTPRequest = (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
    throw new ValidationError('Invalid phone number format');
  }

  next();
};

const validateOTPVerification = (req, res, next) => {
  const { verificationId, code } = req.body;

  if (!verificationId || typeof verificationId !== 'string') {
    throw new ValidationError('Verification ID is required and must be a string');
  }

  if (!/^\d{6}$/.test(code)) {
    throw new ValidationError('OTP code must be a 6-digit number');
  }

  next();
};

const validateGuestLogin = (req, res, next) => {
  const { deviceId, deviceType } = req.body;

  if (!deviceId || typeof deviceId !== 'string') {
    throw new ValidationError('Device ID is required and must be a string');
  }

  if (!deviceType || typeof deviceType !== 'string') {
    throw new ValidationError('Device type is required and must be a string');
  }

  next();
};

const validateProfileUpdate = (req, res, next) => {
  const { firstName, lastName, phone } = req.body;

  if (firstName && typeof firstName !== 'string') {
    throw new ValidationError('Invalid first name format');
  }

  if (lastName && typeof lastName !== 'string') {
    throw new ValidationError('Invalid last name format');
  }

  if (phone && !/^\+?[1-9]\d{1,14}$/.test(phone)) {
    throw new ValidationError('Invalid phone number format');
  }

  next();
};

module.exports = {
  validateOTPRequest,
  validateOTPVerification,
  validateGuestLogin,
  validateProfileUpdate
};
