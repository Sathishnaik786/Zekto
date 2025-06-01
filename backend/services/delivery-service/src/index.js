require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../../../common/utils/db');
const deliveryRoutes = require('./routes/delivery');
const errorHandler = require('../../../common/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/delivery', deliveryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'delivery-service' });
});

// Error handling
app.use(errorHandler);

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Delivery service running on port ${PORT}`);
  });
}); 