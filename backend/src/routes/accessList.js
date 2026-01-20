import express from 'express';
const router = express.Router();
import AccessList from '../models/accessList.js';

router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        const emailExists = await AccessList.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists in the access list"
            })
        }

        const newUserOnAccessList = await AccessList.create({ email });

        return res.status(201).json({
            success: true,
            message: 'Email added to access list successfully',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the email to the access list"
        });
    }
})

export default router;