const Admin = require('../models/Admin');
const { User } = require('@common/models');
const Store = require('@common/schemas/Store');
const Order = require('@common/schemas/Order');
const { NotFoundError, ValidationError } = require('@common/errors');

// Get admin profile
exports.getProfile = async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findById(id).populate('user');
  
  if (!admin) {
    throw new NotFoundError('Admin not found');
  }
  
  res.json(admin);
};

// Update admin profile
exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  
  const admin = await Admin.findByIdAndUpdate(
    id,
    { name, email, phone },
    { new: true }
  );
  
  if (!admin) {
    throw new NotFoundError('Admin not found');
  }
  
  res.json(admin);
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

// Update user status
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      throw new ValidationError('Invalid status value');
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Get all stores
exports.getAllStores = async (req, res, next) => {
  try {
    const stores = await Store.find().populate('owner', 'name email');
    res.status(200).json({
      status: 'success',
      results: stores.length,
      data: { stores }
    });
  } catch (error) {
    next(error);
  }
};

// Update store status
exports.updateStoreStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const store = await Store.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  
  if (!store) {
    throw new NotFoundError('Store not found');
  }
  
  res.json(store);
};

// Get platform statistics
exports.getPlatformStats = async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {};
  
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const [
    totalUsers,
    totalStores,
    totalOrders,
    totalRevenue
  ] = await Promise.all([
    User.countDocuments(query),
    Store.countDocuments(query),
    Order.countDocuments(query),
    Order.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
  ]);
  
  res.json({
    totalUsers,
    totalStores,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0
  });
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  const activities = await Promise.all([
    User.find().sort('-createdAt').limit(5),
    Store.find().sort('-createdAt').limit(5),
    Order.find().sort('-createdAt').limit(5)
  ]);
  
  res.json({
    newUsers: activities[0],
    newStores: activities[1],
    newOrders: activities[2]
  });
}; 