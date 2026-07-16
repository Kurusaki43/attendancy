import nodemailer from 'nodemailer';

import { env } from '@/lib/env/env';

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  // 465 is implicit TLS; every other port (587, Mailpit's 1025) negotiates via STARTTLS instead.
  secure: env.SMTP_PORT === 465,
  auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
});
