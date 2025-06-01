// backend/common/schemas/Store.js
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    minlength: [2, 'Store name must be at least 2 characters long'],
    maxlength: [100, 'Store name cannot exceed 100 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Store owner is required']
  },
  type: {
    type: String,
    required: [true, 'Store type is required'],
    enum: ['restaurant', 'retail', 'service', 'other']
  },
  category: {
    type: String,
    required: [true, 'Store category is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: {
      type: String,
      match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'Please enter a valid URL']
    }
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  businessHours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    open: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
    },
    close: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
    },
    isClosed: {
      type: Boolean,
      default: false
    }
  }],
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
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  documents: [{
    type: {
      type: String,
      enum: ['license', 'tax_certificate', 'insurance', 'other'],
      required: true
    },
    number: String,
    fileUrl: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  settings: {
    acceptsOrders: {
      type: Boolean,
      default: true
    },
    minimumOrderAmount: {
      type: Number,
      default: 0
    },
    deliveryRadius: {
      type: Number,
      default: 5 // in kilometers
    }
  }
}, {
  timestamps: true
});

// Indexes
storeSchema.index({ 'address.location': '2dsphere' });
storeSchema.index({ owner: 1 });
storeSchema.index({ type: 1, category: 1 });
storeSchema.index({ status: 1 });
storeSchema.index({ isVerified: 1 });

// Virtual for full address
storeSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.pincode}`;
});

// Method to check if store is open
storeSchema.methods.isOpen = function() {
  const now = new Date();
  const day = now.toLocaleLowerCase().split(',')[0];
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  
  const todayHours = this.businessHours.find(h => h.day === day);
  if (!todayHours || todayHours.isClosed) return false;
  
  return time >= todayHours.open && time <= todayHours.close;
};

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
