import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, text: string, subject: string) {
  let transporter = await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'recrebot@gmail.com',
      pass: 'RecreB0t!',
    },
  });

  await transporter.sendMail(
    {
      from: 'recrebot@gmail.com',
      to,
      subject,
      html: text,
    },
    (err) => console.log("here's an error", err)
  );
}
