require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../../../common/utils/db');
const adminRoutes = require('./routes/admin');
const errorHandler = require('../../../common/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'admin-service' });
});

// Error handling
app.use(errorHandler);

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Admin service running on port ${PORT}`);
  });
}); 