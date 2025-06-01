// services/customer-service/src/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('@common/utils/db');
const { errorHandler } = require('./middleware/errorHandler');
const customerRoutes = require('./routes/customer');

const app = express();
const PORT = process.env.CUSTOMER_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', customerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Customer service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start customer service:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
