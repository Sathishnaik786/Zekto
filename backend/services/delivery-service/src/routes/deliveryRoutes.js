const express = require('express');
const deliveryController = require('../controllers/deliveryController');
const { UnauthorizedError } = require('@common/errors');

const router = express.Router();

// ✅ Health check or basic service check route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Delivery service is up and running!' });
});

// 🔒 Middleware to check delivery role
// Mock middleware for development/testing
const checkDeliveryRole = (req, res, next) => {
  // MOCK USER
  req.user = { id: '12345', role: 'delivery' }; // ← mock user
  next();
};


// 🚚 Authenticated delivery routes
router.get('/profile', checkDeliveryRole, deliveryController.getProfile);
router.get('/orders', checkDeliveryRole, deliveryController.getAssignedOrders);
router.patch('/orders/:id/status', checkDeliveryRole, deliveryController.updateOrderStatus);
router.post('/', checkDeliveryRole, deliveryController.createDelivery); // ← Added POST route

module.exports = router;
