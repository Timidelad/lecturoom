import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    lectureRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LectureRoom"
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member"
    },
    date: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    purpose: {
        type: String
    },
    status: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;