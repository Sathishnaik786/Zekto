const mongoose = require('mongoose');
const { User } = require('../../../../common/schemas/User');

const deliverySchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['bicycle', 'motorcycle', 'scooter', 'car']
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    match: [/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/, 'Please enter a valid vehicle number']
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
      validate: {
        validator: function(v) {
          return Array.isArray(v) &&
            v.length === 2 &&
            v[0] >= -180 && v[0] <= 180 &&
            v[1] >= -90 && v[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  activeOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    validate: {
      validator: async function(v) {
        if (!v) return true; // allow empty
        const Order = mongoose.model('Order');
        const order = await Order.findById(v);
        return order !== null && order.status === 'in_transit';
      },
      message: 'Invalid active order'
    }
  }],
  completedOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    validate: {
      validator: async function(v) {
        if (!v) return true; // allow empty
        const Order = mongoose.model('Order');
        const order = await Order.findById(v);
        return order !== null && order.status === 'delivered';
      },
      message: 'Invalid completed order'
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['license', 'id_proof', 'vehicle_registration', 'other'],
      required: [true, 'Document type is required']
    },
    number: {
      type: String,
      required: [true, 'Document number is required']
    },
    fileUrl: {
      type: String,
      required: [true, 'Document file URL is required'],
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  earnings: {
    total: {
      type: Number,
      default: 0,
      min: [0, 'Total earnings cannot be negative']
    },
    pending: {
      type: Number,
      default: 0,
      min: [0, 'Pending earnings cannot be negative']
    },
    available: {
      type: Number,
      default: 0,
      min: [0, 'Available earnings cannot be negative']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
deliverySchema.index({ currentLocation: '2dsphere' });
deliverySchema.index({ isAvailable: 1 });
deliverySchema.index({ 'documents.verified': 1 });

// Virtual for verification status
deliverySchema.virtual('isVerified').get(function() {
  return this.documents.length > 0 && this.documents.every(doc => doc.verified);
});

// Virtual for current status
deliverySchema.virtual('status').get(function() {
  if (!this.isAvailable) return 'offline';
  return this.activeOrders.length > 0 ? 'busy' : 'available';
});

// Ensure earnings are consistent
deliverySchema.pre('save', function(next) {
  if (this.isModified('earnings')) {
    this.earnings.total = this.earnings.pending + this.earnings.available;
  }
  next();
});

// Create the Delivery model using the User model as the base
const Delivery = User.discriminator('Delivery', deliverySchema);

module.exports = Delivery;
