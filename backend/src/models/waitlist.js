import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Waitlist = mongoose.model("Waitlist", waitlistSchema);

export default Waitlist;