const mongoose = require('mongoose');
const { User } = require('../../../../common/schemas/User');

const customerSchema = new mongoose.Schema({
  favoriteStores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    validate: {
      validator: async function(v) {
        const Store = mongoose.model('Store');
        const store = await Store.findById(v);
        return store !== null;
      },
      message: 'Store does not exist'
    }
  }],
  savedAddresses: [{
    street: {
      type: String,
      required: [true, 'Street is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    location: {
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
            return v.length === 2 && 
                   v[0] >= -180 && v[0] <= 180 && 
                   v[1] >= -90 && v[1] <= 90;
          },
          message: 'Invalid coordinates'
        }
      }
    }
  }],
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    validate: {
      validator: async function(v) {
        const Order = mongoose.model('Order');
        const order = await Order.findById(v);
        return order !== null;
      },
      message: 'Order does not exist'
    }
  }],
  preferences: {
    notifications: {
      email: { 
        type: Boolean, 
        default: true 
      },
      sms: { 
        type: Boolean, 
        default: true 
      },
      push: { 
        type: Boolean, 
        default: true 
      }
    },
    language: {
      type: String,
      enum: {
        values: ['en', 'hi'],
        message: '{VALUE} is not a supported language'
      },
      default: 'en'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
customerSchema.index({ 'savedAddresses.location': '2dsphere' });
customerSchema.index({ 'favoriteStores': 1 });

// Virtual for default address
customerSchema.virtual('defaultAddress').get(function() {
  return this.savedAddresses.find(addr => addr.isDefault) || this.savedAddresses[0];
});

// Ensure only one default address
customerSchema.pre('save', function(next) {
  if (this.isModified('savedAddresses')) {
    const defaultAddresses = this.savedAddresses.filter(addr => addr.isDefault);
    if (defaultAddresses.length > 1) {
      defaultAddresses.slice(1).forEach(addr => addr.isDefault = false);
    }
  }
  next();
});

// Create the Customer model using the User model as the base
const Customer = User.discriminator('Customer', customerSchema);

module.exports = Customer; 