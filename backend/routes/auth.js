// const express = require('express');
// const bcrypt = require('bcrypt');
// const router = express.Router();
// const FacultyAdmin = require('../models/FacultyAdmin');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const sendEmail = require('../utils/sendEmail');

// router.post('/signup', async (req, res) => {
//     try {
//         const {
//             fullname,
//             matricNumber,
//             facultyName,
//             phone,
//             email,
//             password,
//         } = req.body;

//         // checkong if the email already exists
//         const existingAdmin = await FacultyAdmin.findOne({ email });
//         if (existingAdmin) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         // this will hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const token = crypto.randomBytes(32).toString('hex');

//         // save the new admin in MongoDB
//         const newAdmin = await FacultyAdmin.create({
//             fullname,
//             matricNumber,
//             facultyName,
//             phone,
//             email,
//             password: hashedPassword,
//             verificationToken: token,
//             verified: false,
//             role: 'faculty_Admin',
//         });

//         // send verification email
//         const verifyUrl = `http://localhost:3000/verify?token=${token}`;
//         const html = `
//         <h2>Email verification</h2>
//         <p>Click the link below to verify your account:</p>
//         <a href="${verifyUrl}">Verify Email</a>
//         `;

//         await sendEmail(email, 'Verify your email', html);

//         // send back a response
//         res.status(201).json({
//             message: 'Signup is successful. Check your mail for verification email',
//             adminId: newAdmin._id,
//         })
//     } catch (error) {
//         res
//             .status(500)
//             .json({ message: "signup failed", error: error.message });
//     }
// })

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const admin = await FacultyAdmin.findOne({ email });
//         if (!admin) {
//             return res.status(404).json({ message: 'Email not found' });
//         }

//         if (!admin.verified) {
//             return res.status(403).json({ message: 'please verify your email before logging in' })
//         }

//         const isMatch = await bcrypt.compare(password, admin.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: "Incorrect password" });
//         }

//         const token = jwt.sign(
//             { id: admin._id, role: admin.role },
//             process.env.JWT_SECRET,
//             { expiresIn: '1d' }
//         );
//         res.json({
//             message: 'Login successful',
//             token,
//             admin: {
//                 id: admin._id,
//                 fullName: admin.fullname,
//                 email: admin.email,
//                 facultyName: admin.facultyName,
//             },
//         })
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// })

// module.exports = router;