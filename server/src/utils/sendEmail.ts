import nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';
import { ScrapeResult, TripRequestInterface } from 'src/scraper/scrapeWatcher';
import dayjs from 'dayjs';

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
export const sendEmail = async (to: string, text: string, subject: string) => {
  const transporter = await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: text,
    },
    (err) => console.error('Error sending email', err)
  );
};

export const sendSuccessEmail = async (to: string, result: ScrapeResult) => {
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
      var template = handlebars.compile(html);
      var replacements = {
        hits,
      };
      var htmlToSend = template(replacements);
      sendEmail(to, htmlToSend, 'We Found An Opening From Your Saved Trips');
    }
  );
};
