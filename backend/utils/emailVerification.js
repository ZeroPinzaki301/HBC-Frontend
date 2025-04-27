import nodemailer from'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

export const sendEmail = async(to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,

        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    
    } catch (error) {
        throw new Error("Email not sent: " + error.message);
    }
};