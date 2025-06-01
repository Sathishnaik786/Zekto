const express = require('express');
const cors = require('cors');
const { connectDB } = require('../../../common/utils/db');
const { errorHandler } = require('../../../common/middleware/errorHandler');
const productRoutes = require('./routes/product');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

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
    const port = process.env.PORT || 3006;
    app.listen(port, () => {
      console.log(`Product service running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start product service:', error);
    process.exit(1);
  }
};

startServer(); 