const mongoose = require('mongoose');

const FacultyAdminSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    matricNumber: { type: String, required: true },
    facultyName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    role: { type: String, default: 'faculty_Admin' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FacultyAdmin', FacultyAdminSchema);