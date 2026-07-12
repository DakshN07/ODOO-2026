const mongoose = require('mongoose');

// Counter Schema for atomic auto-increment tagging
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);

// Asset Schema
const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'AssetCategory', required: true },
  assetTag: { type: String, required: true, unique: true }, // Sequential tag e.g. AF-0001
  serialNumber: { type: String, required: true, unique: true },
  acquisitionDate: { type: Date, required: true },
  cost: { type: Number, required: true },
  condition: { type: String, enum: ['New', 'Good', 'Fair', 'Poor'], default: 'Good' },
  location: { type: String, required: true },
  isBookable: { type: Boolean, default: false }, // Shared/Bookable Flag
  status: { 
    type: String, 
    enum: ['Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed'], 
    default: 'Available' 
  },
  createdAt: { type: Date, default: Date.now }
});

// AuditCycle Schema
const AuditCycleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  scope: { type: String, required: true }, // e.g. Engineering Dept or Location
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  auditors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  status: { type: String, enum: ['Draft', 'Active', 'Closed'], default: 'Draft' },
  createdAt: { type: Date, default: Date.now }
});

// DiscrepancyReport Schema
const DiscrepancyReportSchema = new mongoose.Schema({
  auditCycle: { type: mongoose.Schema.Types.ObjectId, ref: 'AuditCycle', required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  auditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  finding: { type: String, enum: ['Verified', 'Missing', 'Damaged'], required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Counter,
  Asset: mongoose.model('Asset', AssetSchema),
  AuditCycle: mongoose.model('AuditCycle', AuditCycleSchema),
  DiscrepancyReport: mongoose.model('DiscrepancyReport', DiscrepancyReportSchema)
};
