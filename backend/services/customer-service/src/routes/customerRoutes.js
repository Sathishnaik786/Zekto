const express = require('express');
const customerController = require('../controllers/customerController');
const { UnauthorizedError } = require('@common/errors');

const router = express.Router();

// Middleware to check customer role
const checkCustomerRole = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    next();
  } else {
    next(new UnauthorizedError('Customer access required'));
  }
};

// Routes
router.get('/profile', checkCustomerRole, customerController.getProfile);
router.patch('/profile', checkCustomerRole, customerController.updateProfile);
router.get('/orders', checkCustomerRole, customerController.getOrders);

module.exports = router; 