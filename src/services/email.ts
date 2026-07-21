const nodemailer = require('nodemailer');
import { IEmail } from '../interfaces/email';
const Mustache = require('mustache');

export const sendMail = async (email: IEmail) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: 'ammar.aimviz@gmail.com',
      pass: '%',
    },
  });

  if (email.isText) {
    await transporter.sendMail({
      from: 'ammar.aimviz@gmail.com',
      to: email.to,
      subject: email.subject,
      text: email.text,
    });
    return true;
  } else {
    //let html = readFileSync(dirname + '/templates/register.html');

    let template = ``;
    if (email.template == 'forget') {
      template = ``;
    }

    var text = Mustache.render(template, { firstName: email.firstName, key: email.key });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email.to,
      subject: email.subject,
      html: text,
    });
    return true;
  }
};
