const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Base route to check if the service is running
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Delivery service is up and running!' });
});

// Profile routes
router.get('/profile/:id', deliveryController.getProfile);
router.patch('/profile/:id', deliveryController.updateProfile);

// Task routes
router.get('/:id/tasks/active', deliveryController.getActiveTasks);
router.get('/:id/tasks/completed', deliveryController.getCompletedTasks);
router.patch('/:id/tasks/:orderId/status', deliveryController.updateTaskStatus);

// Earnings routes
router.get('/:id/earnings', deliveryController.getEarnings);

// Location routes
router.patch('/:id/location', deliveryController.updateLocation);

module.exports = router;
