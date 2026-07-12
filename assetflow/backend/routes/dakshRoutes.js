const express = require('express');
const router = express.Router();
const dakshController = require('../controllers/dakshController');

// Asset routes
router.post('/assets', dakshController.registerAsset);
router.get('/assets', dakshController.getAssets);
router.get('/assets/:id/history', dakshController.getAssetHistory);


// Audit routes
router.post('/audits', dakshController.createAuditCycle);
router.get('/audits', dakshController.getAuditCycles);
router.post('/audits/:id/verify', dakshController.verifyAsset);
router.put('/audits/:id/close', dakshController.closeAuditCycle);

// Discrepancy routes
router.get('/discrepancies', dakshController.getDiscrepancyReports);
router.delete('/discrepancies/:id', dakshController.resolveDiscrepancy);


module.exports = router;
