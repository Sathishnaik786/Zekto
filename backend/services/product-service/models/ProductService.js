const mongoose = require('mongoose');

const productServiceSchema = new mongoose.Schema({
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantityAvailable: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  images: [{
    url: String,
    altText: String
  }],
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, {
  timestamps: true
});

// Indexes for performance
productServiceSchema.index({ merchant: 1 });
productServiceSchema.index({ category: 1 });
productServiceSchema.index({ isActive: 1 });
productServiceSchema.index({ sku: 1 });

// Middleware to update updatedAt
productServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ProductService = mongoose.model('ProductService', productServiceSchema);

module.exports = ProductService;
