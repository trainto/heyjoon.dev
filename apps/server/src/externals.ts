import { createHash } from 'crypto';
import nodemailer from 'nodemailer';
import { env } from './env.js';

export type GoogleUserInfo = {
  email: string;
  name: string;
  picture: string;
};

export const getGoogleUserInfo = async (token: string): Promise<GoogleUserInfo | null> => {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo?fields=name,email,picture', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  return res.json() as Promise<GoogleUserInfo>;
};

export const generateSession = (email: string, now: number): string => {
  return createHash('sha256')
    .update(email + now + env.SECRET)
    .digest('hex');
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: env.GMAIL_SMTP_ID,
    pass: env.GMAIL_SMTP_PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, content: string) => {
  const html = `<div>
    <h2>Places</h2>
    <div>${content}</div>
    <br><br>
    <div>Go to <a href="https://heyjoon.dev/places">Places</a></div>
  </div>`;

  await transporter.sendMail({
    from: 'you@heyjoon.dev',
    to,
    subject,
    html,
  });
};

export const sendTelegramMsg = async (msg: string, to: string) => {
  if (!env.IS_PRODUCTION) return;

  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: to, text: msg }),
  });
};
