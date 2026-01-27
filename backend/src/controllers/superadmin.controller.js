import SuperAdmin from "../models/superAdmin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const superAdminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const adminExists = await SuperAdmin.findOne({ email });
        if (!adminExists) {
            return res.status(401).json({
                success: false,
                messsage: "Invalid credentials"
            })
        }

        const correctPassword = await bcrypt.compare(password, adminExists.password);

        if (!correctPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign(
            { id: adminExists._id, email: email },
            process.env.JWT_SECRET_SUPER_ADMIN,
            { expiresIn: '3h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 3 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Super admin logged in successfully",
            email: email,
            name: adminExists.fullname
        })
    } catch (error) {
        console.error("Error in super admin login:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};