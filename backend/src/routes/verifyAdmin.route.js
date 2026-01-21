import express from 'express';
import { verifyAdminToken } from '../middlewares/verifyTokenAdmin.js';
const router = express.Router();

router.post('/', verifyAdminToken, async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            admin: req.admin
        });
    } catch (error) {
        console.error("Error verifying admin token:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export default router;