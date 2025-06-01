require('module-alias/register');
const express = require('express');
const cors = require('cors');
const deliveryRoutes = require('./routes/deliveryRoutes');

const app = express();
const PORT = process.env.DELIVERY_PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/delivery', deliveryRoutes);

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
  console.log(`Delivery service running on port ${PORT}`);
}); 