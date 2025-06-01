const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const { BadRequestError, ValidationError } = require('../../../common/utils/errors');

const handleOTPLogin = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    const verification = await clerkClient.verifications.createVerification({
      strategy: 'phone_code',
      phoneNumber
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: { verificationId: verification.id }
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { verificationId, code } = req.body;

    const verification = await clerkClient.verifications.attemptVerification({
      verificationId,
      code
    });

    if (verification.status !== 'verified') {
      throw new ValidationError('Invalid or expired OTP');
    }

    // Check if user exists
    let user = await User.findOne({ 'profile.phone': verification.phoneNumber });

    if (!user) {
      user = await User.create({
        clerkId: verification.id,
        email: `${verification.phoneNumber.replace(/\+/g, '')}@guest.com`,
        role: 'customer',
        profile: {
          phone: verification.phoneNumber
        },
        isGuest: true
      });
    }

    const session = await clerkClient.sessions.createSession({
      userId: user.clerkId
    });

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token: session.token,
        user: {
          id: user._id,
          role: user.role,
          isGuest: user.isGuest
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const guestLogin = async (req, res, next) => {
  try {
    const { deviceId, deviceType } = req.body;

    const timestamp = Date.now();
    const guestId = `guest_${timestamp}`;

    const user = await User.create({
      clerkId: guestId,
      email: `${guestId}@guest.com`,
      role: 'customer',
      deviceInfo: {
        deviceId,
        deviceType,
        lastLogin: new Date()
      },
      isGuest: true
    });

    return res.status(201).json({
      success: true,
      message: 'Guest login successful',
      data: {
        userId: user._id,
        role: user.role,
        isGuest: true
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new BadRequestError('User not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleOTPLogin,
  verifyOTP,
  guestLogin,
  updateUserProfile
};
