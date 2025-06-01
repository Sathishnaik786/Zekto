const { ValidationError, NotFoundError, UnauthorizedError } = require('@common/errors');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      errors: err.errors
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      status: 'error',
      message: err.message
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      status: 'error',
      message: err.message
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate field value entered'
    });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors
    });
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

module.exports = errorHandler; 