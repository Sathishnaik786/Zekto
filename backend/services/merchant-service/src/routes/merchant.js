const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const { validateRequest, schemas } = require('../middleware/validateRequest');
const { authenticate } = require('../../../../common/middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Merchants routes
router.get('/merchants', merchantController.getAllMerchants);

router.post('/merchants',
  validateRequest(schemas.createMerchant),
  merchantController.createMerchant
);

router.get('/merchants/:id', merchantController.getMerchantById);

router.patch('/merchants/:id',
  validateRequest(schemas.updateProfile),
  merchantController.updateMerchant
);

router.delete('/merchants/:id', merchantController.deleteMerchant);

// Store management routes
router.post('/merchants/:id/stores',
  validateRequest(schemas.createStore),
  merchantController.createStore
);

router.get('/merchants/:id/stores', merchantController.getStores);

router.patch('/merchants/:id/stores/:storeId',
  validateRequest(schemas.updateStore),
  merchantController.updateStore
);

router.delete('/merchants/:id/stores/:storeId', merchantController.deleteStore);

// Product management routes
router.post('/merchants/:id/stores/:storeId/products',
  validateRequest(schemas.createProduct),
  merchantController.addProduct
);

router.get('/merchants/:id/stores/:storeId/products', merchantController.getProducts);

router.patch('/merchants/:id/stores/:storeId/products/:productId',
  validateRequest(schemas.updateProduct),
  merchantController.updateProduct
);

router.delete('/merchants/:id/stores/:storeId/products/:productId', merchantController.deleteProduct);

// Order management routes
router.get('/merchants/:id/orders', merchantController.getOrders);

router.patch('/merchants/:id/orders/:orderId',
  validateRequest(schemas.updateOrderStatus),
  merchantController.updateOrderStatus
);

module.exports = router;
