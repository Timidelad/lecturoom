const mongoose = require('mongoose');

const accessListSchema = new mongoose.Schema({
    email: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { _id: true });

const AccessList = mongoose.model("AccessList", accessListSchema);

const superAdmin = new mongoose.Schema({
    fullname: { type: String },
    email: { type: String },
    password: { type: String },
    isSuperAdmin: { type: Boolean, default: false },
    verified: { type: Boolean, default: false }
}, { _id: true });

const SuperAdmin = mongoose.model("SuperAdmin", superAdmin);

// Member model
const memberSchema = new mongoose.Schema({
    fullname: { type: String, },
    email: { type: String, },
    matricNumber: { type: String, },
    level: { type: String, },
    phone: { type: String, },
    password: { type: String, },
    isAdmin: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });

const Member = mongoose.model("Member", memberSchema);

// Booking model
const bookingSchema = new mongoose.Schema({
    lectureRoom: {
        type: mongoose.Schema.Types.ObjectId, ref: "LectureRoom"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "Member"
    },
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    purpose: { type: String },
    status: { type: String, },
    createdAt: { type: Date, default: Date.now }
}, { _id: true })

const Booking = mongoose.model("Booking", bookingSchema);

//LectureRoom model
const lectureRoomSchema = new mongoose.Schema({
    roomName: { type: String },
    capacity: { type: Number },
    facilities: [{ type: String }],
    imageUrl: { type: String },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });

const LectureRoom = mongoose.model("LectureRoom", lectureRoomSchema);



const facultySchema = new mongoose.Schema({
    institutionName: { type: String, required: true },
    name: { type: String, required: true },
    bookingStartTime: { type: String },
    bookingEndTime: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
    lectureRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "LectureRoom" }],
    createdAt: { type: Date, default: Date.now }
});

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = {
    Member,
    Booking,
    LectureRoom,
    Faculty,
    AccessList,
    SuperAdmin,
}
// module.exports = mongoose.model('faculty', facultySchema);