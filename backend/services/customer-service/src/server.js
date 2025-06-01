require('module-alias/register');
const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = process.env.CUSTOMER_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customer', customerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Customer service running on port ${PORT}`);
}); 