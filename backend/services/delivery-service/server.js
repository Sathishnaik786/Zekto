const express = require('express');
require('module-alias/register');
const cors = require('cors');
const { connectDB } = require('../../common/utils/db');
const { errorHandler } = require('../../common/middleware/errorHandler');
const deliveryRoutes = require('./src/routes/delivery');
const { delivery: PORT } = require('../../common/config/ports');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/delivery', deliveryRoutes);

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
      console.log(`Delivery service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start delivery service:', error);
    process.exit(1);
  }
};

startServer(); 