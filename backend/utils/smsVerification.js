import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({ // ✅ Corrected 'messages'
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return result;
  } catch (error) {
    throw new Error("SMS not sent: " + error.message);
  }
};