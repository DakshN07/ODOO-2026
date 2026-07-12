const { User, Department, AssetCategory, ActivityLog } = require('../models/YashModels');

const {
    Asset
} = require("../models/DakshModels");

const {
    Allocation,
    ResourceBooking,
    MaintenanceRequest
} = require("../models/AyushModels");

// User login / auth stub
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });

        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        await ActivityLog.create({
            user: user._id,
            action: "User Logged In",
            module: "Authentication"
        });

        res.status(200).json({

            success: true,
            token,

            user: {

                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role

            }

        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

// Admin setup/register stub

exports.registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,

            // Nobody can become Admin while signing up
            role: "Employee"
        });

        await ActivityLog.create({
            user: user._id,
            action: "User Registered",
            module: "Authentication"
        });

        res.status(201).json({
            success: true,
            message: "Registration Successful"
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
};

// Department stubs
exports.createDepartment = async (req, res) => {

    try {

        const {
            name,
            departmentHead,
            parentDepartment,
            status
        } = req.body;

        if (!name) {

            return res.status(400).json({
                success:false,
                message:"Department name required"
            });

        }

        const exists = await Department.findOne({name});

        if(exists){

            return res.status(400).json({

                success:false,
                message:"Department already exists"

            });

        }

        const department = await Department.create({

            name,
            departmentHead,
            parentDepartment,
            status

        });

        await ActivityLog.create({

            user:req.user.id,
            action:"Department Created",
            module:"Organization"

        });

        res.status(201).json({

            success:true,
            department

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

};

exports.getDepartments = async (req,res)=>{

    try{

        const departments = await Department.find()

        .populate("departmentHead","name email");

        res.status(200).json({

            success:true,
            departments

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

};

exports.updateDepartment = async(req,res)=>{

    try{

        const {id} = req.params;

        const department = await Department.findByIdAndUpdate(

            id,

            req.body,

            {
                new:true
            }

        );

        if(!department){

            return res.status(404).json({

                success:false,
                message:"Department not found"

            });

        }

        await ActivityLog.create({

            user:req.user.id,
            action:"Department Updated",
            module:"Organization"

        });

        res.status(200).json({

            success:true,
            department

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

};

// AssetCategory stubs
exports.createAssetCategory = async (req, res) => {

    try {

        const { name, customFields } = req.body;

        if (!name) {

            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });

        }

        const exists = await AssetCategory.findOne({ name });

        if (exists) {

            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });

        }

        const category = await AssetCategory.create({

            name,

            customFields: customFields || []

        });

        await ActivityLog.create({

            user: req.user.id,

            action: "Asset Category Created",

            module: "Organization"

        });

        res.status(201).json({

            success: true,

            category

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

};

exports.getAssetCategories = async (req, res) => {

    try {

        const categories = await AssetCategory.find();

        res.status(200).json({

            success: true,

            categories

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

};

exports.updateAssetCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const category = await AssetCategory.findByIdAndUpdate(

            id,

            req.body,

            {
                new: true
            }

        );

        if (!category) {

            return res.status(404).json({

                success: false,

                message: "Category not found"

            });

        }

        await ActivityLog.create({

            user: req.user.id,

            action: "Asset Category Updated",

            module: "Organization"

        });

        res.status(200).json({

            success: true,

            category

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

};

// Activity logs
exports.getActivityLogs = async (req, res) => {

    try {

        const logs = await ActivityLog.find()

            .populate("user", "name email role")

            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            logs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

//Get Session

exports.getSession = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.status(200).json({

            success: true,
            user

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            error: error.message

        });

    }

};

//Promote user 
exports.promoteUser = async (req, res) => {

    try {

        const { userId, role } = req.body;

        const allowedRoles = [
            "Employee",
            "Department Head",
            "Asset Manager",
            "Admin"
        ];

        if (!allowedRoles.includes(role)) {

            return res.status(400).json({

                success: false,

                message: "Invalid Role"

            });

        }

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        user.role = role;

        await user.save();

        await ActivityLog.create({

            user: req.user.id,

            action: `Promoted ${user.name} to ${role}`,

            module: "Organization"

        });

        res.status(200).json({

            success: true,

            message: "Role Updated",

            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

};

exports.getUsers = async (req, res) => {

    try {

        const users = await User

        .find()

        .populate("department", "name")

        .select("-password");

        res.status(200).json({

            success: true,

            users

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

};

//Dashboard KPI
exports.getDashboardKPIs = async (req, res) => {

    try {

        const totalEmployees = await User.countDocuments();

        const totalDepartments = await Department.countDocuments();

        const totalCategories = await AssetCategory.countDocuments();

        const totalAssets = await Asset.countDocuments();

        const availableAssets = await Asset.countDocuments({
            status: "Available"
        });

        const allocatedAssets = await Asset.countDocuments({
            status: "Allocated"
        });

        const maintenanceAssets = await Asset.countDocuments({
            status: "Under Maintenance"
        });

        const activeAllocations = await Allocation.countDocuments({
            status: "Active"
        });

        const activeBookings = await ResourceBooking.countDocuments({
            status: "Approved"
        });

        const pendingMaintenance = await MaintenanceRequest.countDocuments({
            status: {
                $in: [
                    "Submitted",
                    "Assigned",
                    "In-Progress"
                ]
            }
        });

        res.status(200).json({

            success: true,

            kpis: {

                totalEmployees,

                totalDepartments,

                totalCategories,

                totalAssets,

                availableAssets,

                allocatedAssets,

                maintenanceAssets,

                activeAllocations,

                activeBookings,

                pendingMaintenance

            }

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

};