import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

const readHTMLFile = (path: string, callback: Function) => {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, text: string, subject: string) {
  let transporter = await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  readHTMLFile(
    path.join(__dirname + '/templates/test.html'),
    function (err: Error, html: string) {
      var template = handlebars.compile(html);
      var replacements = {
        name: 'John Doe',
      };
      var htmlToSend = template(replacements);
      transporter.sendMail(
        {
          from: process.env.EMAIL_USER,
          to,
          subject,
          html: htmlToSend,
        },
        (err) => console.log("here's an error", err)
      );
    }
  );
}
