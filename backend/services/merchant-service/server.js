require('module-alias/register');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('../../common/utils/db');
const { errorHandler } = require('../../common/middleware/errorHandler');
const merchantRoutes = require('./src/routes/merchant');
const { merchant: PORT } = require('../../common/config/ports');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/merchant', merchantRoutes);

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