import express from 'express';
import { signup } from '../controllers/authentication.controller.js';
import verifyEmail from '../controllers/verifyEmail.controller.js';
const router = express.Router();

router.post('/signup', signup)
router.post('/verifyEmail', verifyEmail)

export default router;


// router.post('/forgetpassword', async (req, res) => {
//     const { email } = req.body;
//     try {

//         const member = await Member.findOne({ email });

//         if (!member) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email not found'
//             })
//         }

//         const token = crypto.randomBytes(32).toString('hex');
//         member.verificationToken = token;
//         await member.save();

//         const resetUrl = `https://lecturoom.vercel.app/resetpassword?token=${token}`;
//         const htmlContent = `
//         <h2>Password Reset</h2>
//         <p>Click the link below to reset your password:</p>
//         <a href="${resetUrl}">Reset Password</a>
//         `;
//         // await sendEmail(email, 'Reset your password', html);
//         await sendEmailBrevo(email, 'Reset your password', htmlContent)
//         res.status(200).json({
//             success: true,
//             message: 'Password reset link sent to your email'
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error during password reset',
//             error: error.message
//         })
//     }
// })

// router.post("/resetpassword", async (req, res) => {
//     const { password, token } = req.body;
//     if (!token) {
//         return res.status(400).json({
//             success: false,
//             message: "unable to reset password"
//         })
//     }
//     try {
//         const member = await Member.findOne({ verificationToken: token });
//         if (!member) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid or expired token'
//             })
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         member.password = hashedPassword;
//         member.verificationToken = undefined;

//         await member.save();

//         res.status(200).json({
//             success: true,
//             message: 'Password reset successfully'
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'error during password reset',
//             error: error.message
//         })
//     }
// })

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const member = await Member.findOne({ email });

//         // If user not found
//         if (!member) {
//             return res.status(401).json({ success: false, message: 'Incorrect email or password' });
//         }

//         // If not verified
//         if (!member.verified) {
//             return res.status(403).json({ success: false, message: 'Please verify your email before you can login' });
//         }

//         // Check password
//         const isMatch = await bcrypt.compare(password, member.password);
//         if (!isMatch) {
//             return res.status(401).json({ success: false, message: 'Incorrect email or password' });
//         }

//         const faculty = await Faculty.findOne({ members: member._id }).populate('members').populate('lectureRooms');

//         // Generate JWT
//         const token = jwt.sign(
//             { id: member._id, isAdmin: member.isAdmin, facultyId: faculty._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '1d' }
//         );

//         // Find faculty
//         // const faculty = await Faculty.findOne({ members: member._id }).populate('members').populate('lectureRooms');
//         return res.status(200).json({
//             success: true,
//             message: 'Login successful',
//             token,
//         });
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// });

// router.get("/verify-token", (req, res) => {
//     const authHeader = req.headers["authorization"];

//     const token = authHeader && authHeader.split(" ")[1];


//     if (!token) {
//         return res.status(401).json({ valid: false, message: "No token provided" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
//         if (err) {
//             return res.status(403).json({ valid: false, message: "Token invalid or expired" });
//         }
//         try {
//             // const faculty = await Faculty.findOne({ members: user.id })
//             //     .populate("members")
//             //     .populate("lectureRooms");

//             const faculty = await Faculty.findOne({ members: user.id })
//                 .populate("members")
//                 .populate({
//                     path: "lectureRooms",
//                     populate: {
//                         path: "bookings",
//                         populate: [
//                             {
//                                 path: "user",
//                                 select: "fullname email matricNumber level"
//                             },
//                             {
//                                 path: "lectureRoom",
//                                 select: "roomName capacity facilities imageUrl"
//                             }
//                         ]
//                     }
//                 })
//             res.json({ valid: true, userIsAdmin: user.isAdmin, userFaculty: faculty, userId: user.id, });
//         } catch (error) {
//             res.status(500).json({ valid: false, message: "Server error", error: error.message });
//         }
//     });
// });

// router.get("/verify-email", async (req, res) => {
//     const token = req.query.token;

//     try {
//         const member = await Member.findOne({ verificationToken: token });
//         if (!member) {
//             return res.status(400).json({
//                 valid: false,
//                 message: "Invalid or expired token"
//             })
//         }
//         member.verified = true;
//         member.verificationToken = undefined;
//         await member.save()

//         return res.status(200).json({
//             valid: true,
//             message: "Email verified successfully! You can now log in"
//         })
//     } catch (error) {
//         res.status(500).json({
//             valid: false,
//             message: "Something went wrong"
//         })
//     }
// })

// // super admin route
// router.post('/admin-login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const superAdmin = await SuperAdmin.findOne({ email });
//         if (!superAdmin) {
//             return res.status(401).json({ success: false, message: 'Incorrect email or password!!!' });
//         }

//         const isMatch = await bcrypt.compare(password, superAdmin.password);
//         if (!isMatch) {
//             return res.status(401).json({ success: false, message: 'Incorrect email or password' });
//         }

//         const token = jwt.sign(
//             { id: superAdmin._id, isSuperAdmin: superAdmin.isSuperAdmin },
//             process.env.JWT_SECRET,
//             { expiresIn: '1d' }
//         );

//         return res.status(200).json({
//             success: true,
//             message: 'Login successful',
//             token,
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
//     }
// })


// router.get("/verify-admin-token", (req, res) => {
//     const authHeader = req.headers["authorization"];

//     const token = authHeader && authHeader.split(" ")[1];


//     if (!token) {
//         return res.status(401).json({ valid: false, message: "No token provided" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
//         if (err) {
//             return res.status(403).json({ valid: false, message: "Token invalid or expired" });
//         }

//         try {
//             const isSuperAdmin = await SuperAdmin.findById(user.id);
//             if (!isSuperAdmin) {
//                 return res.status(401).json({ valid: false, message: "Sorry you cannnot login" });
//             }
//             res.status(200).json({
//                 valid: true
//             })
//         } catch (error) {
//             res.status(500).json({ valid: false, message: "Server error", error: error.message });
//         }
//     })
// })

// module.exports = router;