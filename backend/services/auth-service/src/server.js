const express = require('express');
const cors = require('cors');
const { connectDB } = require('../../../common/utils/db');
const { errorHandler } = require('../../../common/middleware/errorHandler');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

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
    const port = process.env.PORT || 3007;
    app.listen(port, () => {
      console.log(`Auth service running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start auth service:', error);
    process.exit(1);
  }
};

startServer(); 