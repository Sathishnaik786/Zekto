const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters long'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  subcategory: {
    type: String
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Stock quantity cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    trackInventory: {
      type: Boolean,
      default: true
    }
  },
  variants: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      label: String,
      value: String,
      priceAdjustment: {
        type: Number,
        default: 0
      },
      stock: {
        type: Number,
        default: 0
      }
    }]
  }],
  attributes: [{
    name: String,
    value: String
  }],
  tax: {
    rate: {
      type: Number,
      default: 0,
      min: [0, 'Tax rate cannot be negative']
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes
productSchema.index({ store: 1, category: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ tags: 1 });
productSchema.index({ isAvailable: 1, isFeatured: 1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (!this.discount) return this.price;
  return this.price - (this.price * (this.discount / 100));
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
  if (!this.stock.trackInventory) return true;
  return this.stock.quantity > 0;
};

// Method to check if product is low in stock
productSchema.methods.isLowStock = function() {
  if (!this.stock.trackInventory) return false;
  return this.stock.quantity <= this.stock.lowStockThreshold;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 