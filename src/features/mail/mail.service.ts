import { transporter } from '@/infrastructure/mail/transporter';
import { env } from '@/lib/env';

import { resetPasswordTemplate } from './templates/resetPassword';
import { welcomeEmailTemplate } from './templates/welcome';

type SendMailParams = {
  to: string;
  subject: string;
  html: string;
};

export type SendWelcome = { to: string; name: string };
export type SendResetPassword = { to: string; token: string };

export class MailService {
  private static async sendMail({ to, subject, html }: SendMailParams) {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });
  }

  static sendWelcomeEmail(emailData: SendWelcome) {
    const { html, subject } = welcomeEmailTemplate(emailData.name);
    this.sendMail({
      ...emailData,
      subject,
      html,
    });
  }
  static sendResetPasswordEmail(emailData: SendResetPassword) {
    const { html, subject } = resetPasswordTemplate(emailData.token);
    this.sendMail({
      ...emailData,
      subject,
      html,
    });
  }
}
