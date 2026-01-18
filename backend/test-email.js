require('dotenv').config();
const Brevo = require('sib-api-v3-sdk');

const defaultClient = Brevo.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

(async () => {
  try {
    const firstName = "timilehin";
    const res = await apiInstance.sendTransacEmail({
      sender: { name: 'lecturoom', email: 'yourlecturoom@gmail.com' }, // must match Brevo sender
      to: [{ email: 'timilehinogunlade@gmail.com' }], // replace with your email to receive the test
      subject: 'You are now on LECTUROOM access list',
      htmlContent: `<!doctype html>
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
              Your feedback is important, it will help us improve before before the final launch. If you have any questions or run into issues, you can deop your message in the feedback section in the web app.<br/>
            </p>Or you can contact me directly at <a href="mailto:timilehinogunlade@gmail.com">timilehinogunlade@gmail.com</a>.
            </p>

            <hr style="border:none; border-top:1px solid #eef2f7; margin:22px 0;" />

            <p style="font-size:13px; color:#374151; margin:0 0 6px;"><strong>Thanks for helping us shape LECTUROOM.</strong></p>
            <p class="muted" style="margin:0">— <strong>TÌMÍLÉHÌN</strong></p>
          </td>
        </tr>

      </table>
      <!-- /container -->
    </div>
  </body>
</html>`,
    });
    console.log('Success:', res);
  } catch (err) {
    console.error('Brevo Test Error:', err.response?.body || err.message);
  }
})();
