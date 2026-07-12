const mongoose = require('mongoose');

// Asset Model
const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'AssetCategory', required: true },
  status: { type: String, enum: ['Available', 'Allocated', 'Maintenance', 'Disposed'], default: 'Available' },
  purchaseDate: { type: Date, required: true },
  cost: { type: Number, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// AuditCycle Model
const AuditCycleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['Scheduled', 'In-Progress', 'Completed', 'Cancelled'], default: 'Scheduled' },
  auditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// DiscrepancyReport Model
const DiscrepancyReportSchema = new mongoose.Schema({
  auditCycle: { type: mongoose.Schema.Types.ObjectId, ref: 'AuditCycle', required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  discrepancyType: { type: String, enum: ['Missing', 'Damaged', 'Location Mismatch', 'Unregistered'], required: true },
  description: { type: String },
  status: { type: String, enum: ['Open', 'Investigating', 'Resolved'], default: 'Open' },
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Asset: mongoose.model('Asset', AssetSchema),
  AuditCycle: mongoose.model('AuditCycle', AuditCycleSchema),
  DiscrepancyReport: mongoose.model('DiscrepancyReport', DiscrepancyReportSchema)
};
