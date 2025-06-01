const mongoose = require('mongoose');
const { User } = require('../../../../common/schemas/User');

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:mm 24-hour format

const merchantSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: ['restaurant', 'retail', 'service', 'other']
  },
  gstNumber: {
    type: String,
    required: [true, 'GST number is required'],
    unique: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number']
  },
  bankDetails: {
    accountNumber: {
      type: String,
      required: [true, 'Account number is required'],
      match: [/^[0-9]{9,18}$/, 'Please enter a valid account number']
    },
    ifscCode: {
      type: String,
      required: [true, 'IFSC code is required'],
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code']
    },
    accountHolderName: {
      type: String,
      required: [true, 'Account holder name is required'],
      trim: true
    }
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    validate: {
      validator: async function(v) {
        if (!v) return true; // allow null or undefined store
        const Store = mongoose.model('Store');
        const store = await Store.findById(v);
        return !!store;
      },
      message: 'Store does not exist'
    }
  },
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
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
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
  businessPhone: {
    type: String,
    required: [true, 'Business phone is required'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  businessEmail: {
    type: String,
    required: [true, 'Business email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    lowercase: true,
    trim: true
  },
  documents: [{
    type: {
      type: String,
      enum: ['license', 'tax_certificate', 'insurance', 'other'],
      required: true
    },
    number: {
      type: String,
      required: [true, 'Document number is required']
    },
    fileUrl: {
      type: String,
      required: [true, 'Document file URL is required']
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  isVerified: {
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
  operatingHours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    open: {
      type: String,
      validate: {
        validator: function(v) {
          if (this.isClosed) return true;
          return timeRegex.test(v);
        },
        message: 'Open time must be in HH:mm 24-hour format'
      }
    },
    close: {
      type: String,
      validate: {
        validator: function(v) {
          if (this.isClosed) return true;
          return timeRegex.test(v);
        },
        message: 'Close time must be in HH:mm 24-hour format'
      }
    },
    isClosed: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

merchantSchema.index({ 'businessAddress.location': '2dsphere' });
merchantSchema.index({ businessName: 1 });
merchantSchema.index({ businessType: 1 });
merchantSchema.index({ isVerified: 1 });

merchantSchema.pre('save', function(next) {
  this.earnings.total = (this.earnings.pending || 0) + (this.earnings.available || 0);
  next();
});

// Ensure User schema has discriminatorKey option before using discriminator
const Merchant = User.discriminator('Merchant', merchantSchema);

module.exports = Merchant;
