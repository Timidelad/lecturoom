const express = require('express');
const jwt = require('jsonwebtoken');
const Faculty = require('../models/faculty');
const router = express.Router();

router.get('/faculty/data', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided!' })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const faculty = await Faculty.findOne({ 'members._id': decoded.id });

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' })
        }

        const member = faculty.members.find(m => m._id.toString() === decoded.id);

        if (!member) {
            return res.status(404).json({ message: 'Member not found' })
        }
        res.json({
            university: faculty.institutionName,
            facultyName: faculty.name,
            currentUser: {
                id: member._id,
                fullname: member.fullname,
                email: member.email,
                isAdmin: member.isAdmin,
                level: member.level,
                phone: member.phone
            },
            members: faculty.members.filter(m => m.verified).map(({ fullname, email, level, isAdmin, _id }) => ({
                fullname, email, level, isAdmin, _id
            })),
            lectureRooms: faculty.lectureRooms
        })
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
})

module.exports = router;