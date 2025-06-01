const Delivery = require('../models/Delivery');
const Order = require('@common/schemas/Order');
const { NotFoundError, ValidationError } = require('@common/errors');
const { User } = require('@common/models');

// Get delivery person profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
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

// Update delivery person profile
exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, vehicleType, vehicleNumber } = req.body;
  
  const delivery = await Delivery.findByIdAndUpdate(
    id,
    { name, email, phone, vehicleType, vehicleNumber },
    { new: true }
  );
  
  if (!delivery) {
    throw new NotFoundError('Delivery person not found');
  }
  
  res.json(delivery);
};

// Get active delivery tasks
exports.getActiveTasks = async (req, res) => {
  const { id } = req.params;
  const tasks = await Order.find({
    deliveryPerson: id,
    status: { $in: ['assigned', 'picked_up', 'in_transit'] }
  })
  .populate('customer')
  .populate('store')
  .populate('items.product')
  .sort('-createdAt');
  
  res.json(tasks);
};

// Get completed delivery tasks
exports.getCompletedTasks = async (req, res) => {
  const { id } = req.params;
  const tasks = await Order.find({
    deliveryPerson: id,
    status: 'delivered'
  })
  .populate('customer')
  .populate('store')
  .populate('items.product')
  .sort('-createdAt');
  
  res.json(tasks);
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  const { id, orderId } = req.params;
  const { status } = req.body;
  
  const order = await Order.findOneAndUpdate(
    { _id: orderId, deliveryPerson: id },
    { status },
    { new: true }
  );
  
  if (!order) {
    throw new NotFoundError('Order not found');
  }
  
  res.json(order);
};

// Get earnings
exports.getEarnings = async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;
  
  const query = { deliveryPerson: id, status: 'delivered' };
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const orders = await Order.find(query);
  const earnings = orders.reduce((total, order) => total + order.deliveryFee, 0);
  
  res.json({ earnings, orderCount: orders.length });
};

// Get current location
exports.updateLocation = async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;
  
  const delivery = await Delivery.findByIdAndUpdate(
    id,
    { currentLocation: { latitude, longitude } },
    { new: true }
  );
  
  if (!delivery) {
    throw new NotFoundError('Delivery person not found');
  }
  
  res.json(delivery);
};

// Get assigned orders
exports.getAssignedOrders = async (req, res, next) => {
  try {
    // This is a placeholder - you would implement actual order fetching logic
    res.status(200).json({
      status: 'success',
      message: 'Assigned orders endpoint - to be implemented'
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['picked', 'in_transit', 'delivered'].includes(status)) {
      throw new ValidationError('Invalid order status');
    }

    // This is a placeholder - you would implement actual order status update logic
    res.status(200).json({
      status: 'success',
      message: 'Order status update endpoint - to be implemented'
    });
  } catch (error) {
    next(error);
  }
}; 