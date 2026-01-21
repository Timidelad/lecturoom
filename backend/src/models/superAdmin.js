import mongoose from "mongoose";

const superAdmin = new mongoose.Schema({
    fullname: {
        type: String
    },

    email: {
        type: String
    },

    password: {
        type: String
    },

    isSuperAdmin: {
        type: Boolean,
        default: false
    },

    token: {
        type: String,
        default: undefined
    },

    verified: {
        type: Boolean,
        default: false
    }
});

const SuperAdmin = mongoose.model("SuperAdmin", superAdmin);
export default SuperAdmin;