const { Allocation, ResourceBooking, MaintenanceRequest } = require('../models/AyushModels');
const { Asset } = require('../models/DakshModels');
const { User, ActivityLog } = require('../models/YashModels');

// =============================================
//  ALLOCATION ENDPOINTS
// =============================================

// POST /allocations — Allocate asset (conflict check)
exports.createAllocation = async (req, res) => {
  try {
    const { assetId, allocatedTo, department, expectedReturnDate, notes } = req.body;

    // Find the asset
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    // Check if asset is available
    if (asset.status !== 'Available') {
      // Find current holder
      const currentAllocation = await Allocation.findOne({
        asset: assetId,
        status: 'Active'
      }).populate('allocatedTo', 'name email');

      const holderName = currentAllocation?.allocatedTo?.name || 'Unknown';

      return res.status(409).json({
        success: false,
        message: `Asset is currently ${asset.status}. Held by ${holderName}.`,
        currentHolder: currentAllocation?.allocatedTo || null,
        currentAllocationId: currentAllocation?._id || null,
        canTransfer: asset.status === 'Allocated'
      });
    }

    // Create allocation
    const allocation = await Allocation.create({
      asset: assetId,
      allocatedTo,
      allocatedBy: req.user.id,
      department: department || null,
      expectedReturnDate: expectedReturnDate || null,
      notes: notes || '',
      status: 'Active'
    });

    // Update asset status to Allocated
    asset.status = 'Allocated';
    await asset.save();

    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: `Allocated asset "${asset.name}" (${asset.assetTag}) to user`,
      module: 'Allocation'
    });

    const populated = await Allocation.findById(allocation._id)
      .populate('asset', 'name assetTag status')
      .populate('allocatedTo', 'name email')
      .populate('allocatedBy', 'name email')
      .populate('department', 'name');

    res.status(201).json({ success: true, allocation: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /allocations — List allocations with filters
exports.getAllocations = async (req, res) => {
  try {
    const { status, department } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (department) filter.department = department;

    const allocations = await Allocation.find(filter)
      .populate('asset', 'name assetTag status condition location')
      .populate('allocatedTo', 'name email')
      .populate('allocatedBy', 'name email')
      .populate('department', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, allocations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /allocations/transfer — Request transfer
exports.transferAllocation = async (req, res) => {
  try {
    const { allocationId, newUserId, notes } = req.body;

    const allocation = await Allocation.findById(allocationId);
    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation not found' });
    }

    if (allocation.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'Only active allocations can be transferred' });
    }

    // Mark as transfer requested
    allocation.status = 'Transfer Requested';
    allocation.notes = notes || `Transfer requested to user ${newUserId}`;
    await allocation.save();

    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: `Transfer requested for allocation ${allocationId}`,
      module: 'Allocation'
    });

    const populated = await Allocation.findById(allocation._id)
      .populate('asset', 'name assetTag')
      .populate('allocatedTo', 'name email')
      .populate('department', 'name');

    res.status(200).json({ success: true, message: 'Transfer requested', allocation: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /allocations/:id/approve-transfer — Approve transfer
exports.approveTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUserId, newDepartment } = req.body;

    const allocation = await Allocation.findById(id);
    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation not found' });
    }

    if (allocation.status !== 'Transfer Requested') {
      return res.status(400).json({ success: false, message: 'No pending transfer for this allocation' });
    }

    // Close old allocation
    allocation.status = 'Returned';
    allocation.actualReturnDate = new Date();
    allocation.returnNotes = 'Transferred to another user';
    await allocation.save();

    // Create new allocation for the new user
    const newAllocation = await Allocation.create({
      asset: allocation.asset,
      allocatedTo: newUserId,
      allocatedBy: req.user.id,
      department: newDepartment || allocation.department,
      expectedReturnDate: allocation.expectedReturnDate,
      status: 'Active'
    });

    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: `Approved transfer for asset, re-allocated to new user`,
      module: 'Allocation'
    });

    const populated = await Allocation.findById(newAllocation._id)
      .populate('asset', 'name assetTag')
      .populate('allocatedTo', 'name email')
      .populate('department', 'name');

    res.status(200).json({ success: true, message: 'Transfer approved', allocation: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /allocations/:id/return — Return asset
exports.returnAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { returnNotes } = req.body;

    const allocation = await Allocation.findById(id);
    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation not found' });
    }

    if (allocation.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'Only active allocations can be returned' });
    }

    // Mark as returned
    allocation.status = 'Returned';
    allocation.actualReturnDate = new Date();
    allocation.returnNotes = returnNotes || '';
    await allocation.save();

    // Revert asset to Available
    const asset = await Asset.findById(allocation.asset);
    if (asset) {
      asset.status = 'Available';
      await asset.save();
    }

    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: `Returned asset "${asset?.name || 'Unknown'}" (${asset?.assetTag || 'N/A'})`,
      module: 'Allocation'
    });

    const populated = await Allocation.findById(allocation._id)
      .populate('asset', 'name assetTag')
      .populate('allocatedTo', 'name email');

    res.status(200).json({ success: true, message: 'Asset returned successfully', allocation: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================================
//  RESOURCE BOOKING ENDPOINTS
// =============================================

// POST /bookings — Create booking (overlap validation)
exports.createBooking = async (req, res) => {
  try {
    const { assetId, startTime, endTime, purpose } = req.body;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' });
    }

    // Check if asset exists and is bookable
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    // Overlap check: find any active booking that overlaps [start, end)
    const overlap = await ResourceBooking.findOne({
      asset: assetId,
      status: { $in: ['Upcoming', 'Ongoing'] },
      startTime: { $lt: end },
      endTime: { $gt: start }
    }).populate('user', 'name email');

    if (overlap) {
      return res.status(409).json({
        success: false,
        message: `Time slot conflicts with existing booking by ${overlap.user?.name || 'Unknown'} (${new Date(overlap.startTime).toLocaleString()} - ${new Date(overlap.endTime).toLocaleString()})`,
        conflictingBooking: overlap
      });
    }

    // Create booking
    const booking = await ResourceBooking.create({
      asset: assetId,
      user: req.user.id,
      startTime: start,
      endTime: end,
      purpose: purpose || '',
      status: 'Upcoming'
    });

    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: `Booked resource "${asset.name}" (${asset.assetTag}) from ${start.toLocaleString()} to ${end.toLocaleString()}`,
      module: 'Booking'
    });

    const populated = await ResourceBooking.findById(booking._id)
      .populate('asset', 'name assetTag location')
      .populate('user', 'name email');

    res.status(201).json({ success: true, booking: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /bookings — List all bookings
exports.getBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const bookings = await ResourceBooking.find(filter)
      .populate('asset', 'name assetTag location isBookable')
      .populate('user', 'name email')
      .sort({ startTime: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /bookings/asset/:assetId — Bookings for a specific asset (calendar data)
exports.getBookingsByAsset = async (req, res) => {
  try {
    const { assetId } = req.params;

    const bookings = await ResourceBooking.find({
      asset: assetId,
      status: { $ne: 'Cancelled' }
    })
      .populate('user', 'name email')
      .sort({ startTime: 1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /bookings/:id/cancel — Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await ResourceBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'Completed' || booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed or already cancelled booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: `Cancelled booking ${id}`,
      module: 'Booking'
    });

    res.status(200).json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================================
//  MAINTENANCE REQUEST ENDPOINTS
// =============================================

// POST /maintenance — Raise maintenance request
exports.createMaintenance = async (req, res) => {
  try {
    const { assetId, issueDescription, priority, photo } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    const request = await MaintenanceRequest.create({
      asset: assetId,
      submittedBy: req.user.id,
      issueDescription,
      priority: priority || 'Medium',
      photo: photo || '',
      status: 'Pending'
    });

    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: `Raised maintenance request for "${asset.name}" (${asset.assetTag})`,
      module: 'Maintenance'
    });

    const populated = await MaintenanceRequest.findById(request._id)
      .populate('asset', 'name assetTag status condition')
      .populate('submittedBy', 'name email');

    res.status(201).json({ success: true, request: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /maintenance — List all maintenance requests
exports.getMaintenance = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const requests = await MaintenanceRequest.find(filter)
      .populate('asset', 'name assetTag status condition location')
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /maintenance/:id — Update maintenance status (workflow)
exports.updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTechnician, resolutionNotes } = req.body;

    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

    // Validate workflow transitions
    const validTransitions = {
      'Pending': ['Approved', 'Rejected'],
      'Approved': ['Technician Assigned'],
      'Technician Assigned': ['In Progress'],
      'In Progress': ['Resolved'],
      'Rejected': [],
      'Resolved': []
    };

    if (!validTransitions[request.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from "${request.status}" to "${status}". Valid: ${validTransitions[request.status]?.join(', ') || 'none'}`
      });
    }

    // Update fields based on transition
    request.status = status;

    if (status === 'Approved') {
      // Set asset to Under Maintenance
      const asset = await Asset.findById(request.asset);
      if (asset) {
        asset.status = 'Under Maintenance';
        await asset.save();
      }
    }

    if (status === 'Technician Assigned' && assignedTechnician) {
      request.assignedTechnician = assignedTechnician;
    }

    if (status === 'Resolved') {
      request.resolvedAt = new Date();
      request.resolutionNotes = resolutionNotes || '';

      // Revert asset to Available
      const asset = await Asset.findById(request.asset);
      if (asset) {
        asset.status = 'Available';
        await asset.save();
      }
    }

    await request.save();

    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: `Updated maintenance request ${id} to "${status}"`,
      module: 'Maintenance'
    });

    const populated = await MaintenanceRequest.findById(request._id)
      .populate('asset', 'name assetTag status')
      .populate('submittedBy', 'name email');

    res.status(200).json({ success: true, message: `Status updated to ${status}`, request: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
