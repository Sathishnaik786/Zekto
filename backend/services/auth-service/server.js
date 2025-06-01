require('dotenv').config();
require('module-alias/register');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('../../common/utils/db');
const { errorResponse } = require('../../common/utils/response');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Auth service is running' });
});

// Global error handling
app.use((err, req, res, next) => {
  errorResponse(res, err);
});

// Database connection
connectDB(process.env.MONGODB_URI);

// Start server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`✅ Auth service running on port ${PORT}`);
});

module.exports = app;
