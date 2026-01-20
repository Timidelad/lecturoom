import express from 'express';
import Waitlist from '../models/waitlist.js';
import addToBrevoList from '../utils/addToBrevoList.js';
const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email } = req.body;
    try {
        const emailExists = await Waitlist.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists in the waitlist. We will notify you when you can access the platform."
            })
        }
        const newWaitlistEntry = await Waitlist.create({ name, email });
        const addToList = await addToBrevoList(email, name);

        return res.status(201).json({
            success: true,
            message: 'You have been added to the waitlist successfully. We will notify you when you can access the platform.',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding you to the waitlist. Please try again later."
        });
    }
})

export default router;