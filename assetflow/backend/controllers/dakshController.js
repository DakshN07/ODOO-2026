const { Counter, Asset, AuditCycle, DiscrepancyReport } = require('../models/DakshModels');
const { Allocation, MaintenanceRequest } = require('../models/AyushModels');

// Asset Directory & Registration
exports.registerAsset = async (req, res) => {
  try {
    const { name, category, serialNumber, acquisitionDate, cost, condition, location, isBookable } = req.body;

    if (!name || !category || !serialNumber || !acquisitionDate || !cost || !location) {
      return res.status(400).json({ success: false, message: 'Required fields missing: name, category, serialNumber, acquisitionDate, cost, location' });
    }

    // Atomic update of the counter
    const counter = await Counter.findOneAndUpdate(
      { _id: 'asset_tag_counter' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Format serial tag padded with 4 zeros: e.g. AF-0001
    const seqStr = String(counter.seq).padStart(4, '0');
    const assetTag = `AF-${seqStr}`;

    const newAsset = new Asset({
      name,
      category,
      assetTag,
      serialNumber,
      acquisitionDate,
      cost,
      condition: condition || 'Good',
      location,
      isBookable: isBookable || false,
      status: 'Available'
    });

    await newAsset.save();
    res.status(201).json({ success: true, asset: newAsset });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getAssets = async (req, res) => {
  try {
    const { search, category, status, location } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { assetTag: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const assets = await Asset.find(query).populate('category');
    res.status(200).json({ success: true, count: assets.length, assets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Audits stubs
exports.createAuditCycle = async (req, res) => {
  try {
    res.status(201).json({ success: true, message: 'Audit cycle scheduled mock response' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAuditCycles = async (req, res) => {
  try {
    res.status(200).json({ success: true, auditCycles: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Discrepancy Reports stubs
exports.getDiscrepancyReports = async (req, res) => {
  try {
    res.status(200).json({ success: true, reports: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.resolveDiscrepancy = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: 'Discrepancy resolved mock response' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAssetHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch allocations
    const allocations = await Allocation.find({ asset: id })
      .populate('allocatedTo', 'name email')
      .populate('allocatedBy', 'name email');

    // Fetch maintenance requests
    const maintenance = await MaintenanceRequest.find({ asset: id })
      .populate('requestedBy', 'name email')
      .populate('assignedTo', 'name email');

    const historyEvents = [];

    allocations.forEach(alloc => {
      historyEvents.push({
        type: 'allocation',
        date: alloc.allocatedDate,
        status: alloc.status,
        notes: alloc.notes,
        user: alloc.allocatedTo ? alloc.allocatedTo.name : 'Unknown User',
        userEmail: alloc.allocatedTo ? alloc.allocatedTo.email : '',
        by: alloc.allocatedBy ? alloc.allocatedBy.name : 'System',
        returnDate: alloc.returnDate
      });
      if (alloc.status === 'Returned' && alloc.returnDate) {
        historyEvents.push({
          type: 'return',
          date: alloc.returnDate,
          status: 'Returned',
          user: alloc.allocatedTo ? alloc.allocatedTo.name : 'Unknown User',
          userEmail: alloc.allocatedTo ? alloc.allocatedTo.email : '',
          by: alloc.allocatedBy ? alloc.allocatedBy.name : 'System'
        });
      }
    });

    maintenance.forEach(maint => {
      historyEvents.push({
        type: 'maintenance',
        date: maint.createdAt,
        status: maint.status,
        priority: maint.priority,
        notes: maint.issueDescription,
        user: maint.requestedBy ? maint.requestedBy.name : 'Unknown User',
        assignedTo: maint.assignedTo ? maint.assignedTo.name : 'Unassigned',
        cost: maint.cost
      });
      if (maint.resolvedAt) {
        historyEvents.push({
          type: 'maintenance_resolved',
          date: maint.resolvedAt,
          status: 'Resolved',
          notes: 'Maintenance completed',
          cost: maint.cost
        });
      }
    });

    // Sort by date descending
    historyEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ success: true, history: historyEvents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

