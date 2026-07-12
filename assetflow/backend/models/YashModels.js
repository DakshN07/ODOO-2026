const mongoose = require('mongoose');

// User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'User'], default: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Department Model
const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// AssetCategory Model
const AssetCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  depreciationRate: { type: Number, default: 0 }, // percentage per year
  createdAt: { type: Date, default: Date.now }
});

// ActivityLog Model
const ActivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: String },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Department: mongoose.model('Department', DepartmentSchema),
  AssetCategory: mongoose.model('AssetCategory', AssetCategorySchema),
  ActivityLog: mongoose.model('ActivityLog', ActivityLogSchema)
};
