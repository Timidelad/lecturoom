const express = require('express');
const router = express.Router();
const { Faculty, Member } = require('../models/faculty');

router.get('/verify-email', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "verification token is missing"
        })
    }
    try {
        const member = await Member.findOne({ verificationToken: token });

        if (!member) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            })
        }

        member.verified = true;
        member.verificationToken = undefined;
        await member.save()

        return res.status(201).json({
            success: true,
            message: "Email verified successfully. You can now login"
        })

    } catch (error) {
        console.error('verification error:', error.message)
        return res.status(500).json({
            success: false,
            message: "verification failed",
            error: error.message
        })
    }
})

module.exports = router;