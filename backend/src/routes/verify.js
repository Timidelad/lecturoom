const express = require('express');
const router = express.Router();
const FacultyAdmin = require('../models/FacultyAdmin');

router.get('/verify', async (req, res) => {
    const token = req.query.token;

    try {
        const admin = await FacultyAdmin.findOne({ verificationToken: token });

        if (!admin) {
            return res.status(400).send('Invalid or expired token')
        }

        admin.verified = true;
        admin.verificationToken = undefined;
        await admin.save();

        res.send('Email verified successfully! You can now log in')
    } catch (error) {
        res.status(500).send('verification failed')
    }
})
// 
module.exports = router;