import { env } from '@/lib/env/env';

import { transporter } from '../lib/transporter';
import { emailVerificationTemplate } from '../templates/emailVerification';
import { passwordResetTemplate } from '../templates/resetPassword';
import { welcomeTemplate } from '../templates/welcome';

type SendMailParams = {
  to: string;
  subject: string;
  html: string;
};

export type SendWelcome = { to: string; firstName: string };
export type SendResetPassword = { to: string; resetUrl: string; firstName: string };
export type SendVerificationEmail = { to: string; code: string; firstName: string };

export class MailService {
  private static async sendMail({ to, subject, html }: SendMailParams) {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });
  }
  static sendVerificationEmail(emailData: SendVerificationEmail) {
    const { html, subject } = emailVerificationTemplate(emailData.firstName, emailData.code);
    this.sendMail({
      ...emailData,
      subject,
      html,
    });
  }
  static sendWelcomeEmail(emailData: SendWelcome) {
    const { html, subject } = welcomeTemplate(emailData.firstName);
    this.sendMail({
      ...emailData,
      subject,
      html,
    });
  }
  static sendResetPasswordEmail(emailData: SendResetPassword) {
    const { html, subject } = passwordResetTemplate(emailData.firstName, emailData.resetUrl);
    this.sendMail({
      ...emailData,
      subject,
      html,
    });
  }
}
