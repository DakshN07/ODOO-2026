const express = require('express');
const router = express.Router();
const ayushController = require('../controllers/ayushController');

// Allocation routes
router.post('/allocations', ayushController.createAllocation);
router.get('/allocations', ayushController.getAllocations);

// Booking routes
router.post('/bookings', ayushController.createBooking);
router.get('/bookings', ayushController.getBookings);

// Maintenance routes
router.post('/maintenance', ayushController.createMaintenanceRequest);
router.get('/maintenance', ayushController.getMaintenanceRequests);

module.exports = router;
