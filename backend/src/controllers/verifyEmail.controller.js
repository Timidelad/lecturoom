import Member from "../models/member.js";

const verifyEmail = async (req, res) => {
    const token = req.query.token;

    try {
        const member = await Member.findOne({ verificationToken: token });

        if (!member) {
            return res.status(400).send('Invalid or expired token')
        }

        member.verified = true;
        member.verificationToken = undefined;
        await member.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully! You can now log in'
        })
    } catch (error) {
        res.status(500).send('verification failed')
    }
}

export default verifyEmail;