const { Counter, Asset, AuditCycle, DiscrepancyReport } = require('../models/DakshModels');

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
