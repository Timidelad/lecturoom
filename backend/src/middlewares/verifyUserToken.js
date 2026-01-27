import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const verifyUserToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false
        })
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_USER);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false
        })
    }
};
