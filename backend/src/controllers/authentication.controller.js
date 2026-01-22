import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Faculty from '../models/faculty.js';
import AccessList from '../models/accessList.js';
import Member from '../models/member.js'
import sendEmailBrevo from '../utils/sendEmailBrevo.js';

// controller for the signup route
export const signup = async (req, res) => {
    const {
        fullname,
        matricNumber,
        institutionName,
        level,
        facultyName,
        phoneNumber,
        email,
        password
    } = req.body;

    try {
        // check if user exist on the access list
        const inAccessList = await AccessList.findOne({ email });
        if (!inAccessList) {
            return res.status(400).json({
                success: false,
                message: "You cannnot create an account because you are not on the access list. kindly click join to be added to the list"
            })
        }
        const facultyNameLower = facultyName.toLowerCase();
        const institutionNameLower = institutionName.toLowerCase();

        // Check if faculty already exists
        const existingFaculty = await Faculty.findOne({
            name: facultyNameLower,
            institutionName: institutionNameLower,
        });

        if (existingFaculty) {
            return res.status(400).json({
                success: false,
                message: 'Faculty already exists',
            });
        }

        // check if user already exist
        const existingUser = await Member.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exist"
            })
        }

        // Hash user password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate token for verification
        const token = crypto.randomBytes(32).toString('hex');

        // Link to email verification
        const verifyUrl = `https://lecturoom.vercel.app/verify-email?token=${token}`;

        // Email structure
        const htmlContent = `
        <h2>Email verification</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyUrl}">Verify Email</a>
        `;

        // Send verification email
        await sendEmailBrevo(email, 'verify your email', htmlContent);

        // Create member
        const newMember = await Member.create({
            fullname,
            email,
            matricNumber,
            level,
            phoneNumber,
            password: hashedPassword,
            verificationToken: token,
            isAdmin: true,
            verified: false,
        });

        // Create faculty
        const newFaculty = await Faculty.create({
            institutionName: institutionNameLower,
            name: facultyNameLower,
            members: [newMember._id],
        });

        return res.status(201).json({
            success: true,
            message: 'Faculty environment created successfully. Check your email to verify your account.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};