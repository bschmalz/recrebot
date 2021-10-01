import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

export const sendSMS = (recipient: string) => {
  if (phoneNumber && accountSid && authToken) {
    try {
      const client = new Twilio(accountSid, authToken);
      client.messages
        .create({
          body: 'A trip on recrebot got an opening. Check your email.',
          from: phoneNumber,
          to: `+1${recipient}`,
        })
        .then((message) => console.log(message.sid));
    } catch (e) {}
  }
};
