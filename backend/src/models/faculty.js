import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
    institutionName: {
        type: String,
    },

    facultyName: {
        type: String
    },
    bookingStartTime: {
        type: String,
    },
    bookingEndTime: {
        type: String
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member"
    }],
    lectureRooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LectureRoom"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Faculty = mongoose.model("Faculty", facultySchema);
export default Faculty;