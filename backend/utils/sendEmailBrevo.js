const Brevo = require('sib-api-v3-sdk');

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
    // email.subject = subject;
    // email.htmlContent = htmlContent;
    // email.sender = { name: "yourvisibly", email: "yourvisibly@gmail.com" };
    // email.to = [{ email: to }];

    try {
        const response = await apiInstance.sendTransacEmail(email);
        // console.log("Brevo Email sent:", response.messageId);
    } catch (error) {
        console.error("Brevo email error:", error.message);
        // throw new Error("Failed to send email with Brevo");
    }
}

module.exports = sendEmailBrevo;