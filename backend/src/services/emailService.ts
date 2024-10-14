// services/emailService.ts
import nodemailer, { Transporter } from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Email options interface
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// Nodemailer Transporter
const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',  // You can replace it with any email service you want to use
  auth: {
    user: process.env.EMAIL_USER,  // Your email address (from .env)
    pass: process.env.EMAIL_PASS,  // Your email password (from .env)
  },
});


const sendRegistrationEmail = async (toEmail: string, userName: string, password: string): Promise<void> => {
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER!,  // Sender address (use ! to assert non-null)
    to: toEmail,  // Recipient address
    subject: 'Welcome to Our Service!',
    html: `
      <html>
        <body>
          <h1>Welcome, ${userName}!</h1>
          <p>Thank you for registering with us. We're excited to have you on board.</p>
          <p>Your account has been successfully created. Your password is: ${password}\n\nPlease change it as soon as possible.</p>
          <p>If you have any questions, feel free to reach out.</p>
          <p>Best regards,</p>
          <p>The Team</p>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { sendRegistrationEmail };
