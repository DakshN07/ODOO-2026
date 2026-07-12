const express = require('express');
const router = express.Router();
const dakshController = require('../controllers/dakshController');

// Asset routes
router.post('/assets', dakshController.registerAsset);
router.get('/assets', dakshController.getAssets);

// Audit routes
router.post('/audits', dakshController.createAuditCycle);
router.get('/audits', dakshController.getAuditCycles);

// Discrepancy routes
router.get('/discrepancies', dakshController.getDiscrepancyReports);
router.put('/discrepancies/:id/resolve', dakshController.resolveDiscrepancy);

module.exports = router;
