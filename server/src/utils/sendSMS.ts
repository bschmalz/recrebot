import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

export const sendSMS = (recipient: number) => {
  if (phoneNumber && accountSid && authToken) {
    const client = new Twilio(accountSid, authToken);
    client.messages
      .create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs.',
        from: phoneNumber,
        to: '+18182843837',
      })
      .then((message) => console.log(message.sid));
  }
};
