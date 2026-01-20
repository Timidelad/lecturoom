import dotenv from 'dotenv';
dotenv.config();

import Brevo from 'sib-api-v3-sdk'

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

async function sendEmailBrevo(to, subject, htmlContent) {
    const email = {
        sender: { name: 'lecturoom', email: 'yourlecturoom@gmail.com' }, // must match Brevo sender
        to: [{ email: to }],
        subject,
        htmlContent,
    };

    try {
        const response = await apiInstance.sendTransacEmail(email);
        console.log("Brevo Email sent:", response.messageId);
    } catch (error) {
        console.error("Brevo email error:", error.message);
        throw new Error("Failed to send email with Brevo");
    }
}

export default sendEmailBrevo;