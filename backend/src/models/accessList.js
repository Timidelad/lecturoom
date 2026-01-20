import mongoose from "mongoose";

const accessListSchema = new mongoose.Schema({
    email: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AccessList = mongoose.model('AccessList', accessListSchema);

export default AccessList;