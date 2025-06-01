const express = require('express');
const adminController = require('../controllers/adminController');
const { UnauthorizedError } = require('@common/errors');

const router = express.Router();

// Middleware to check admin role
const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new UnauthorizedError('Admin access required'));
  }
};

// Routes
router.get('/users', checkAdminRole, adminController.getAllUsers);
router.get('/stores', checkAdminRole, adminController.getAllStores);
router.patch('/users/:id/status', checkAdminRole, adminController.updateUserStatus);

module.exports = router; 