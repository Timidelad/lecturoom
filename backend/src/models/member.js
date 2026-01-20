import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    fullname: {
        type: String
    },

    email: {
        type: String
    },

    matricNumber: {
        type: String
    },
    level: {
        type: Number
    },
    phone: {
        type: Number
    },
    password: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Member = mongoose.model("Member", memberSchema);
export default Member;