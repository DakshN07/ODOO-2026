const express = require('express');
const router = express.Router();
const yashController = require('../controllers/yashController');

// User & Admin routes
router.post('/login', yashController.loginUser);
router.post('/register', yashController.registerUser);

// Department routes
router.post('/departments', yashController.createDepartment);
router.get('/departments', yashController.getDepartments);

// Asset Category routes
router.post('/categories', yashController.createAssetCategory);
router.get('/categories', yashController.getAssetCategories);

// Activity logs
router.get('/logs', yashController.getActivityLogs);

module.exports = router;
