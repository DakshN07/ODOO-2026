// const express = require('express');
// const router = express.Router();
// const yashController = require('../controllers/yashController');

// // User & Admin routes
// router.post('/login', yashController.loginUser);
// router.post('/register', yashController.registerUser);

// // Department routes
// router.post('/departments', yashController.createDepartment);
// router.get('/departments', yashController.getDepartments);

// // Asset Category routes
// router.post('/categories', yashController.createAssetCategory);
// router.get('/categories', yashController.getAssetCategories);

// // Activity logs
// router.get('/logs', yashController.getActivityLogs);

// module.exports = router;


const express = require("express");

const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/admin");

const {

    loginUser,
    registerUser,
    createDepartment,
    getDepartments,
    createAssetCategory,
    getAssetCategories,
    getActivityLogs,
    getSession,
    updateDepartment,
    updateAssetCategory,
    promoteUser,
    getUsers,
    getDashboardKPIs

} = require("../controllers/yashController");


router.post("/auth/signup", registerUser);

router.post("/auth/login", loginUser);

router.post("/departments", verifyToken, createDepartment);

router.get("/departments", verifyToken, getDepartments);

router.post("/categories", verifyToken, createAssetCategory);

router.get("/categories", verifyToken, getAssetCategories);

router.put(
    "/categories/:id",
    verifyToken,
    updateAssetCategory
);

router.get("/logs",verifyToken, getActivityLogs);

router.get("/auth/session", verifyToken, getSession);

router.put(
    "/departments/:id",
    verifyToken,
    updateDepartment
);

router.get(
    "/users",
    verifyToken,
    getUsers
);

router.put(
    "/admin/promote",
    verifyToken,
    isAdmin,
    promoteUser
);

router.get(
    "/dashboard/kpis",
    verifyToken,
    getDashboardKPIs
);

module.exports = router;