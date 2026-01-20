import mongoose from "mongoose";

const lectureRoomSchema = new mongoose.Schema({
    roomName: {
        type: String
    },
    capacity: {
        type: Number
    },
    facilities: [{
        type: String
    }],
    imageUrl: {
        type: String
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    }],
    isAvailable: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LectureRoom = mongoose.model("LectureRoom", lectureRoomSchema);
export default LectureRoom;