const Customer = require('../models/Customer');
const Store = require('@common/schemas/Store');
const Order = require('@common/schemas/Order');
const { User } = require('@common/models');
const { NotFoundError, ValidationError } = require('@common/errors');

// Get all customers with pagination and filtering
exports.getCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Customer.countDocuments(query)
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new customer
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();

    res.status(201).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    next(error);
  }
};

// Get customer profile
exports.getProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('favoriteStores')
      .populate('orderHistory');

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    res.status(200).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    next(error);
  }
};

// Update customer profile
exports.updateProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    res.status(200).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    next(error);
  }
};

// Add favorite store
exports.addFavoriteStore = async (req, res, next) => {
  try {
    const { storeId } = req.body;
    
    const store = await Store.findById(storeId);
    if (!store) {
      throw new NotFoundError('Store not found');
    }
    
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { favoriteStores: storeId } },
      { new: true }
    );
    
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    next(error);
  }
};

// Remove favorite store
exports.removeFavoriteStore = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $pull: { favoriteStores: req.params.storeId } },
      { new: true }
    );
    
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    next(error);
  }
};

// Get customer orders with pagination
exports.getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const [orders, total] = await Promise.all([
      Order.find({ customer: req.params.id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments({ customer: req.params.id })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add saved address
exports.addSavedAddress = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $push: { savedAddresses: req.body } },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    next(error);
  }
};

// Remove saved address
exports.removeSavedAddress = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $pull: { savedAddresses: { _id: req.params.addressId } } },
      { new: true }
    );
    
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    next(error);
  }
}; 