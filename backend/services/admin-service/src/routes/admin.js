const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Profile routes
router.get('/profile/:id', adminController.getProfile);
router.patch('/profile/:id', adminController.updateProfile);

// User management routes
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);

// Store management routes
router.get('/stores', adminController.getAllStores);
router.patch('/stores/:id/status', adminController.updateStoreStatus);

// Analytics routes
router.get('/stats', adminController.getPlatformStats);
router.get('/activity', adminController.getRecentActivity);

module.exports = router; 