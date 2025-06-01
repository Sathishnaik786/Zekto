const Joi = require('joi');
const { ValidationError } = require('@common/errors');

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
  createCustomer: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    preferences: Joi.object({
      notifications: Joi.object({
        email: Joi.boolean(),
        sms: Joi.boolean(),
        push: Joi.boolean()
      }),
      language: Joi.string().valid('en', 'hi')
    })
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
    address: Joi.string()
  }),

  addAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
    isDefault: Joi.boolean(),
    location: Joi.object({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required()
    })
  }),

  addFavoriteStore: Joi.object({
    storeId: Joi.string().required()
  })
};

module.exports = {
  validateRequest,
  schemas
}; 