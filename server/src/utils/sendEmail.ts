import nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';
import { ScrapeResult } from '../scraper/scrapeWatcher';
import dayjs from 'dayjs';
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const readHTMLFile = (path: string, callback: Function) => {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (
  to: string,
  text: string,
  subject: string,
  from?: string
) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_EMAIL,
      subject,
      html: from ? `<p>Email: ${from}</p>` + `<p>Message: ${text}</p>` : text,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });

    // old gmail implementaion
    // const transporter = await nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true, // use SSL
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // await transporter.sendMail(
    //   {
    //     from: process.env.EMAIL_USER,
    //     to,
    //     subject,
    //     html: from ? `<p>Email: ${from}</p>` + `<p>Message: ${text}</p>` : text,
    //   },
    //   (err) => {
    //     if (err) console.error('Error sending email', err);
    //   }
    // );
  } catch (e) {}
};

export const sendSuccessEmail = async (to: string, result: ScrapeResult) => {
  try {
    const hits: { name: string; dates: string; url: string }[] = [];
    for (let name in result) {
      const dates = result[name].dates
        .map((d) => dayjs(d).format('MM/DD'))
        .join(',');
      hits.push({ name, dates, url: result[name].url });
    }

    readHTMLFile(
      __dirname + '/templates/success.html',
      function (err: Error, html: any) {
        const template = handlebars.compile(html);
        const replacements = {
          hits,
        };
        const htmlToSend = template(replacements);
        sendEmail(to, htmlToSend, 'We Found An Opening From Your Saved Trips');
      }
    );
  } catch (e) {}
};

export const sendInvite = async (to: string, url: string) => {
  try {
    readHTMLFile(
      __dirname + '/templates/invite.html',
      function (err: Error, html: any) {
        const template = handlebars.compile(html);
        const replacements = {
          url,
        };
        const htmlToSend = template(replacements);
        sendEmail(to, htmlToSend, 'RecreBot Invitation');
      }
    );
  } catch (e) {}
};

export const sendPasswordReset = async (to: string, url: string) => {
  try {
    readHTMLFile(
      __dirname + '/templates/resetPassword.html',
      function (err: Error, html: any) {
        const template = handlebars.compile(html);
        const replacements = {
          url,
        };
        const htmlToSend = template(replacements);
        sendEmail(to, htmlToSend, 'Reset Your Password');
      }
    );
  } catch (e) {}
};
