const Joi = require('joi');
const { ValidationError } = require('../../../../common/errors');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      throw new ValidationError('Validation Error', errors);
    }

    next();
  };
};

// Validation schemas
const schemas = {
  createMerchant: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    businessName: Joi.string().required(),
    businessType: Joi.string().required(),
    taxId: Joi.string().required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().pattern(/^[0-9]{6}$/).required()
    }).required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
    businessName: Joi.string(),
    businessType: Joi.string(),
    taxId: Joi.string(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      pincode: Joi.string().pattern(/^[0-9]{6}$/)
    })
  }),

  createStore: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
      location: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required()
      })
    }).required(),
    operatingHours: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    }).required()
  }),

  updateStore: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      pincode: Joi.string().pattern(/^[0-9]{6}$/),
      location: Joi.object({
        type: Joi.string().valid('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2)
      })
    }),
    operatingHours: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    })
  }),

  createProduct: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()),
    stock: Joi.number().integer().min(0).required(),
    attributes: Joi.object(),
    isAvailable: Joi.boolean()
  }),

  updateProduct: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().min(0),
    category: Joi.string(),
    images: Joi.array().items(Joi.string().uri()),
    stock: Joi.number().integer().min(0),
    attributes: Joi.object(),
    isAvailable: Joi.boolean()
  }),

  updateOrderStatus: Joi.object({
    status: Joi.string().valid('accepted', 'preparing', 'ready', 'delivered', 'cancelled').required(),
    estimatedDeliveryTime: Joi.date().min('now'),
    notes: Joi.string()
  })
};

module.exports = {
  validateRequest,
  schemas
}; 