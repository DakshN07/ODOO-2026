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


// Audits
exports.createAuditCycle = async (req, res) => {
  try {
    const { title, scope, startDate, endDate, auditors } = req.body;
    if (!title || !scope || !startDate || !endDate || !auditors || !auditors.length) {
      return res.status(400).json({ success: false, message: 'Missing required audit cycle fields' });
    }

    const newCycle = new AuditCycle({
      title,
      scope,
      startDate,
      endDate,
      auditors,
      status: 'Active'
    });

    await newCycle.save();
    res.status(201).json({ success: true, auditCycle: newCycle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAuditCycles = async (req, res) => {
  try {
    const cycles = await AuditCycle.find().populate('auditors', 'name email');
    res.status(200).json({ success: true, auditCycles: cycles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Discrepancy Reports
exports.getDiscrepancyReports = async (req, res) => {
  try {
    const { auditCycleId } = req.query;
    const filter = {};
    if (auditCycleId) {
      filter.auditCycle = auditCycleId;
    }

    const reports = await DiscrepancyReport.find(filter)
      .populate('asset')
      .populate('auditor', 'name email')
      .populate('auditCycle');
    res.status(200).json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyAsset = async (req, res) => {
  try {
    const { id } = req.params; // audit cycle ID
    const { assetId, finding, notes } = req.body;

    if (!assetId || !finding) {
      return res.status(400).json({ success: false, message: 'assetId and finding required' });
    }

    const cycle = await AuditCycle.findById(id);
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Audit cycle not found' });
    }
    if (cycle.status === 'Closed') {
      return res.status(400).json({ success: false, message: 'Audit cycle is closed' });
    }

    const auditorId = req.body.auditorId || cycle.auditors[0];

    const report = await DiscrepancyReport.findOneAndUpdate(
      { auditCycle: id, asset: assetId },
      { auditor: auditorId, finding, notes, createdAt: new Date() },
      { new: true, upsert: true }
    );

    if (finding === 'Verified') {
      await Asset.findByIdAndUpdate(assetId, { status: 'Available', condition: 'Good' });
    } else if (finding === 'Damaged') {
      await Asset.findByIdAndUpdate(assetId, { status: 'Under Maintenance', condition: 'Poor' });
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.closeAuditCycle = async (req, res) => {
  try {
    const { id } = req.params;

    const cycle = await AuditCycle.findById(id);
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Audit cycle not found' });
    }

    cycle.status = 'Closed';
    await cycle.save();

    const missingReports = await DiscrepancyReport.find({ auditCycle: id, finding: 'Missing' });
    const assetIds = missingReports.map(r => r.asset);

    if (assetIds.length > 0) {
      await Asset.updateMany(
        { _id: { $in: assetIds } },
        { $set: { status: 'Lost' } }
      );
    }

    res.status(200).json({ success: true, message: 'Audit cycle closed and missing assets marked as Lost', updatedAssetsCount: assetIds.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.resolveDiscrepancy = async (req, res) => {
  try {
    const { id } = req.params;
    await DiscrepancyReport.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Discrepancy resolved (removed)' });
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

