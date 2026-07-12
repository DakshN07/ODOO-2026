const express = require('express');
const router = express.Router();
const ayushController = require('../controllers/ayushController');
const { verifyToken } = require('../middleware/auth');

// ============ ALLOCATION ROUTES ============
router.post('/allocations', verifyToken, ayushController.createAllocation);
router.get('/allocations', verifyToken, ayushController.getAllocations);
router.post('/allocations/transfer', verifyToken, ayushController.transferAllocation);
router.put('/allocations/:id/approve-transfer', verifyToken, ayushController.approveTransfer);
router.put('/allocations/:id/return', verifyToken, ayushController.returnAsset);

// ============ BOOKING ROUTES ============
router.post('/bookings', verifyToken, ayushController.createBooking);
router.get('/bookings', verifyToken, ayushController.getBookings);
router.get('/bookings/asset/:assetId', verifyToken, ayushController.getBookingsByAsset);
router.put('/bookings/:id/cancel', verifyToken, ayushController.cancelBooking);

// ============ MAINTENANCE ROUTES ============
router.post('/maintenance', verifyToken, ayushController.createMaintenance);
router.get('/maintenance', verifyToken, ayushController.getMaintenance);
router.put('/maintenance/:id', verifyToken, ayushController.updateMaintenance);

module.exports = router;
