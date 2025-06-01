const mongoose = require('mongoose');

const orderServiceSchema = new mongoose.Schema({
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
    index: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming User schema exists for customers
    required: true,
    index: true
  },
  items: [{
    serviceName: { type: String, required: true },
    description: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    total: {
      type: Number,
      required: true,
      min: 0,
      // Could use a setter to auto calculate: quantity * price
      default: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'processing', 'completed', 'cancelled'],
    default: 'placed'
  },
  serviceDate: {
    type: Date,
    required: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  notes: String
}, {
  timestamps: true
});

// Indexes for performance on frequent queries
orderServiceSchema.index({ merchant: 1 });
orderServiceSchema.index({ customer: 1 });
orderServiceSchema.index({ orderStatus: 1 });
orderServiceSchema.index({ paymentStatus: 1 });

// Middleware to update updatedAt
orderServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const OrderService = mongoose.model('OrderService', orderServiceSchema);

module.exports = OrderService;
