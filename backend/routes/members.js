const express = require('express');
const router = express.Router();
const { Faculty, Member, SuperAdmin, AccessList } = require('../models/faculty');
const crypto = require("crypto");
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmailBrevo = require('../utils/sendEmailBrevo');
const addToBrevoList = require('../utils/addToBrevoList');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: 'No token provided' })

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

router.post("/invite", (req, res) => {
    const authHeader = req.headers["authorization"];
    const { email, matricNumber } = req.body;

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "unable to send an invite"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Unable to send an invite"
            })
        }

        try {
            const member = await Member.findOne({ email });
            if (member) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use"
                })
            }
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const newMember = await Member.create({
                email,
                matricNumber,
                verified: false,
                isAdmin: false,
                verificationToken
            });
            await newMember.save();

            const faculty = await Faculty.findOne({ members: user.id });
            faculty.members.push(newMember._id)
            await faculty.save();

            const verifyUrl = `https://lecturoom.vercel.app/complete-registration?token=${verificationToken}`;

            const htmlContent = `
                <h2>You have been Invited to join ${faculty.name} lecturoom environment</h2>
                <p>Click on the link below to complete your profile registration:</p>
                <a href="${verifyUrl}">Complete Setup</a>
            `;

            await sendEmailBrevo(email, 'You have been invited', htmlContent)

            // await sendEmail(email, 'You have been invited to join your faculty environment', html)

            return res.status(200).json({
                success: true,
                message: 'Invitation sent successfully'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error during invitation",
                error: error.message
            })
        }

    })
})



router.get('/user-info', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Token is required"
        });
    }

    try {
        const member = await Member.findOne({ verificationToken: token });

        if (!member) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Token is valid",
            email: member.email,
            matricNumber: member.matricNumber
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Error during validation",
            error: error.message
        })
    }
});



// POST: /members/complete-registration
router.post('/complete-registration', async (req, res) => {
    const { token, fullname, password, phone, level } = req.body;

    try {
        const member = await Member.findOne({ verificationToken: token });

        if (!member) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        member.fullname = fullname;
        member.password = hashedPassword;
        member.phone = phone;
        member.level = level;
        member.verified = true;
        member.verificationToken = undefined;
        await member.save();

        return res.status(200).json({
            success: true,
            message: 'Registration completed successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

//add to access list
router.post('/add-to-wait-list', async (req, res) => {
    const { firstName, email } = req.body;

    try {
        const result = await addToBrevoList(email, firstName);
        res.status(200).json(result);
    } catch (error) {
        console.error(error)
        // Send a 409 Conflict for existing email, 500 for others
        if (error.message.includes('already exist')) {
            return res.status(409).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
})


router.post('/add-to-access-list', async (req, res) => {
    const authHeader = req.headers["authorization"];
    const { email, firstName } = req.body;

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "unable to send an invite"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Unable to add user to access list"
            })
        }

        try {
            const superAdmin = await SuperAdmin.findById(user.id);
            if (!superAdmin) {
                return res.status(401).json({
                    success: false,
                    message: "You dont have access to add user to access list"
                })
            }

            const member = await AccessList.findOne({ email });
            if (member) {
                return res.status(400).json({
                    success: false,
                    message: "This user already exist in the access list"
                })
            }

            const htmlContent = `
             <!doctype html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="x-apple-disable-message-reformatting">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Welcome to LECTUROOM</title>
                    <style>
                    /* Basic resets */
                    body { margin:0; padding:0; background-color:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
                    table { border-collapse: collapse; }
                    img { border:0; display:block; }
                    a { color: #1f6feb; text-decoration: none; }
                    /* Container */
                    .container { width:100%; max-width:600px; margin: 0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 6px 18px rgba(22,27,34,0.08); }
                    .pad { padding: 28px; }
                    .hero { background-color: #0f1724; color: #fff; padding: 28px; text-align:left; }
                    .h1 { font-size: 22px; font-weight: 700; margin: 0 0 8px; }
                    .lead { font-size: 15px; margin: 0 0 18px; color: rgba(255,255,255,0.9); line-height:1.4; }
                    .body-text { color: #111827; font-size: 15px; line-height: 1.6; margin: 0 0 18px; }
                    .btn { display:inline-block; background:#5A56EA; color:#ffffff; padding:9px 9px; border-radius:8px; font-weight:600; }
                    .muted { color:#6b7280; font-size:13px; }
                    .footer { font-size:12px; color:#9ca3af; text-align:center; padding:18px; }
                    @media (max-width:420px) {
                        .pad { padding:18px; }
                        .h1 { font-size:18px; }
                    }
                    </style>
                </head>

                <body>
                    <div style="width:100%; background-color:#f4f6f8; padding:28px 12px;">
                    <!-- container -->
                    <table class="container" width="100%" role="presentation" cellpadding="0" cellspacing="0">

                        <tr>
                        <td class="pad">
                            <p class="body-text">Hi <strong>${firstName}</strong>,</p>

                            <p class="body-text">
                            I have added your email to <strong>LECTUROOM access list</strong>, so you can now register and start testing the platform. 
                            </p>

                            <p class="body-text">
                            <strong>Here's what to do next:</strong><br/>
                            1. Register your account here : <span style="text-align:left; margin: 18px 0;"><a href="https://lecturoom.vercel.app/signup" class="btn" target="_blank" rel="noopener">Register Now</a></span><br/>
                            2. After registering, you automatically become the faculty admin. So you are expected to upload the lecture rooms within your faculty,  upload the booking hours of your faculty and invite all the class representatives in your faculty <br/>
                            3. Try out the booking features, make edits or cancellation, and see how it works for your faculty.
                            </p>

                            <p class="body-text">
                            Your feedback is important, it will help us improve before the final launch. If you have any questions or run into issues, you can send us a message through the feedback section of the web app.<br/>
                            </p>Or you can contact us directly by replying to this mail</p>

                            <hr style="border:none; border-top:1px solid #eef2f7; margin:22px 0;" />

                            <p style="font-size:13px; color:#374151; margin:0 0 6px;"><strong>Thanks for helping us shape LECTUROOM.</strong></p>
                            <p class="muted" style="margin:0">— <strong>TÌMÍLÉHÌN</strong></p>
                        </td>
                        </tr>

                    </table>
                    <!-- /container -->
                    </div>
                </body>
                </html>
            `;

            await sendEmailBrevo(email, "LECTUROOM Early Access Granted", htmlContent)
            const newAccess = await AccessList.create({
                email
            });

            return res.status(200).json({
                success: true,
                message: 'User Added successfully',
            });
        } catch (error) {

        }
    })
})

module.exports = router;