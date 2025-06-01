const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};

module.exports = {
  successResponse,
  errorResponse
}; 