const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  validateOTPRequest,
  validateOTPVerification,
  validateGuestLogin,
  validateProfileUpdate
} = require('../middleware/validate');
const { verifyJWT, checkRole } = require('../../../common/middleware/auth');

// Public routes
router.post('/otp/send', validateOTPRequest, authController.handleOTPLogin);
router.post('/otp/verify', validateOTPVerification, authController.verifyOTP);
router.post('/guest', validateGuestLogin, authController.guestLogin);

// Protected route for updating user profile
router.patch(
  '/profile/:userId',
  verifyJWT,
  checkRole(['customer', 'merchant', 'delivery', 'admin']),
  validateProfileUpdate,
  authController.updateUserProfile
);

module.exports = router;
