const mongoose = require('mongoose');

// Allocation Model
const AllocationSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  allocatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  allocatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  allocatedDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: { type: String, enum: ['Active', 'Returned', 'Overdue'], default: 'Active' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// ResourceBooking Model (e.g., meeting room, lab equipment booking)
const ResourceBookingSchema = new mongoose.Schema({
  resourceName: { type: String, required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  purpose: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// MaintenanceRequest Model
const MaintenanceRequestSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDescription: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Submitted', 'Assigned', 'In-Progress', 'Resolved', 'Cancelled'], default: 'Submitted' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cost: { type: Number, default: 0 },
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Allocation: mongoose.model('Allocation', AllocationSchema),
  ResourceBooking: mongoose.model('ResourceBooking', ResourceBookingSchema),
  MaintenanceRequest: mongoose.model('MaintenanceRequest', MaintenanceRequestSchema)
};
