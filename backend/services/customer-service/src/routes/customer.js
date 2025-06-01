const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { validateRequest, schemas } = require('../middleware/validateRequest');
const { authenticate } = require('@common/middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/customers - Get all customers with pagination and search
router.get('/', customerController.getCustomers);

// POST /api/customers - Create new customer
router.post('/', 
  validateRequest(schemas.createCustomer),
  customerController.createCustomer
);

// Profile routes
router.get('/profile/:id', customerController.getProfile);

router.patch('/profile/:id',
  validateRequest(schemas.updateProfile),
  customerController.updateProfile
);

// Favorite stores routes
router.post('/:id/favorites',
  validateRequest(schemas.addFavoriteStore),
  customerController.addFavoriteStore
);

router.delete('/:id/favorites/:storeId', customerController.removeFavoriteStore);

// Orders routes
router.get('/:id/orders', customerController.getOrders);

// Address routes
router.post('/:id/addresses',
  validateRequest(schemas.addAddress),
  customerController.addSavedAddress
);

router.delete('/:id/addresses/:addressId', customerController.removeSavedAddress);

module.exports = router; 