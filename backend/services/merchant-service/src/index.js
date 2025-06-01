require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('@common/utils/db');
const { errorHandler } = require('./middleware/errorHandler');
const merchantRoutes = require('./routes/merchant');

const app = express();
const PORT = process.env.MERCHANT_PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', merchantRoutes);

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
      console.log(`Merchant service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start merchant service:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; 