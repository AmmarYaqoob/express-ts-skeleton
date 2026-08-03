import { readFileSync } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import Mustache from 'mustache';
import config from '../config';
import { IEmail } from '../interfaces/email';

function loadTemplate(templateName: string): string {
  const templatePath = path.join(
    __dirname,
    '..',
    'templates',
    `${templateName}.html`,
  );
  return readFileSync(templatePath, 'utf8');
}

function getTemplate(email: IEmail): string {
  if (email.template === 'forget') {
    return loadTemplate('verifyemail');
  }
  return loadTemplate('register');
}

export const sendMail = async (email: IEmail): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  const from = config.smtp.from || config.smtp.user;

  if (email.isText) {
    await transporter.sendMail({
      from,
      to: email.to,
      subject: email.subject,
      text: email.text,
    });
    return true;
  }

  const template = getTemplate(email);
  const html = Mustache.render(template, {
    firstName: email.firstName,
    name: email.firstName,
    key: email.key,
    Verification_Link: email.key,
  });

  await transporter.sendMail({
    from,
    to: email.to,
    subject: email.subject,
    html,
  });

  return true;
};
