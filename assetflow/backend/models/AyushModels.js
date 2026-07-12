const mongoose = require('mongoose');

// ================= ALLOCATION =================
const AllocationSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  allocatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  allocatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  allocatedDate: { type: Date, default: Date.now },
  expectedReturnDate: { type: Date, default: null },
  actualReturnDate: { type: Date, default: null },
  returnNotes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Active', 'Returned', 'Transfer Requested'],
    default: 'Active'
  },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// ================= RESOURCE BOOKING =================
const ResourceBookingSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  purpose: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  createdAt: { type: Date, default: Date.now }
});

// ================= MAINTENANCE REQUEST =================
const MaintenanceRequestSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDescription: { type: String, required: true },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Technician Assigned', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  assignedTechnician: { type: String, default: '' },
  resolutionNotes: { type: String, default: '' },
  photo: { type: String, default: '' },
  resolvedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Allocation: mongoose.model('Allocation', AllocationSchema),
  ResourceBooking: mongoose.model('ResourceBooking', ResourceBookingSchema),
  MaintenanceRequest: mongoose.model('MaintenanceRequest', MaintenanceRequestSchema)
};
