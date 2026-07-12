const mongoose = require("mongoose");


// ================= USER =================

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    password:{
        type:String,
        required:true
    },

    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department",
        default:null
    },

    role:{
        type:String,
        enum:[
            "Employee",
            "Asset Manager",
            "Department Head",
            "Admin"
        ],
        default:"Employee"
    },

    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    }

},
{
    timestamps:true
}
);


// ================= DEPARTMENT =================

const departmentSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    departmentHead:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    parentDepartment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department",
        default:null
    },

    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    }

},
{
    timestamps:true
}
);


// ================= CATEGORY =================

const assetCategorySchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    customFields:[
        {
            type:String
        }
    ]

},
{
    timestamps:true
}
);


// ================= ACTIVITY LOG =================

const activityLogSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    action:{
        type:String
    },

    module:{
        type:String
    }

},
{
    timestamps:true
}
);


const User = mongoose.model("User",userSchema);

const Department = mongoose.model("Department",departmentSchema);

const AssetCategory = mongoose.model("AssetCategory",assetCategorySchema);

const ActivityLog = mongoose.model("ActivityLog",activityLogSchema);

module.exports={
    User,
    Department,
    AssetCategory,
    ActivityLog
};