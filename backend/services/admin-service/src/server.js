require('module-alias/register');
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.ADMIN_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);

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
  console.log(`Admin service running on port ${PORT}`);
}); 