const Merchant = require('../models/Merchant');
const { ValidationError } = require('../../../../common/errors');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get merchant profile
exports.getProfile = async (req, res, next) => {
  try {
    const merchant = await Merchant.findById(req.params.id).populate('storeId');
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    res.json(merchant);
  } catch (error) {
    next(error);
  }
};

// Update merchant profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, businessName, businessType, gstNumber, bankDetails } = req.body;
    const merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      { name, email, businessName, businessType, gstNumber, bankDetails },
      { new: true, runValidators: true }
    );
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    res.json(merchant);
  } catch (error) {
    next(error);
  }
};

// Get merchant store
exports.getStore = async (req, res, next) => {
  try {
    const merchant = await Merchant.findById(req.params.id).populate('storeId');
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    if (!merchant.storeId) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(merchant.storeId);
  } catch (error) {
    next(error);
  }
};

// Update merchant store
exports.updateStore = async (req, res, next) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    const store = await Store.findByIdAndUpdate(
      merchant.storeId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    next(error);
  }
};

// Get merchant products
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ merchantId: req.params.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Add a new product
exports.addProduct = async (req, res, next) => {
  try {
    const store = await Store.findOne({ _id: req.params.storeId, merchantId: req.params.id });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    const product = new Product({ ...req.body, storeId: req.params.storeId });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Update a product  <--- ADDED method
exports.updateProduct = async (req, res, next) => {
  try {
    const { id: merchantId, storeId, productId } = req.params;

    // Verify the store belongs to the merchant
    const store = await Store.findOne({ _id: storeId, merchantId });
    if (!store) {
      return res.status(404).json({ message: 'Store not found or does not belong to merchant' });
    }

    // Update the product under that store
    const product = await Product.findOneAndUpdate(
      { _id: productId, storeId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const store = await Store.findOne({ _id: req.params.storeId, merchantId: req.params.id });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    const product = await Product.findOneAndDelete({ _id: req.params.productId, storeId: req.params.storeId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get merchant orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ merchantId: req.params.id })
      .populate('customerId')
      .populate('items.productId')
      .populate('deliveryPersonId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: orderId, merchantId: req.params.id },
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Get earnings
exports.getEarnings = async (req, res, next) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    res.json(merchant.earnings);
  } catch (error) {
    next(error);
  }
};

// Create a new merchant
exports.createMerchant = async (req, res, next) => {
  try {
    const merchant = new Merchant(req.body);
    await merchant.save();
    res.status(201).json(merchant);
  } catch (error) {
    next(error);
  }
};

// Get all merchants
exports.getAllMerchants = async (req, res, next) => {
  try {
    const merchants = await Merchant.find();
    res.json(merchants);
  } catch (error) {
    next(error);
  }
};

// Get merchant by ID
exports.getMerchantById = async (req, res, next) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    res.json(merchant);
  } catch (error) {
    next(error);
  }
};

// Update merchant
exports.updateMerchant = async (req, res, next) => {
  try {
    const merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    res.json(merchant);
  } catch (error) {
    next(error);
  }
};

// Delete merchant
exports.deleteMerchant = async (req, res, next) => {
  try {
    const merchant = await Merchant.findByIdAndDelete(req.params.id);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    res.json({ message: 'Merchant deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get nearby merchants
exports.getNearbyMerchants = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    const merchants = await Merchant.find({
      'businessAddress.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    res.json(merchants);
  } catch (error) {
    next(error);
  }
};

// Create a new store
exports.createStore = async (req, res, next) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    const store = new Store({ ...req.body, merchantId: req.params.id });
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    next(error);
  }
};

// Get all stores for a merchant
exports.getStores = async (req, res, next) => {
  try {
    const stores = await Store.find({ merchantId: req.params.id });
    res.json(stores);
  } catch (error) {
    next(error);
  }
};

// Delete a store
exports.deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findOneAndDelete({ _id: req.params.storeId, merchantId: req.params.id });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    next(error);
  }
};
