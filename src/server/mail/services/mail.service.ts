import { env } from '@/lib/env/env';
import { sendViaResendApi } from '@/server/mail/lib/resend-client';
import { transporter } from '@/server/mail/lib/transporter';
import { emailVerificationTemplate } from '@/server/mail/templates/emailVerification';
import { passwordResetTemplate } from '@/server/mail/templates/resetPassword';
import { welcomeTemplate } from '@/server/mail/templates/welcome';

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
    if (env.RESEND_API_KEY) {
      await sendViaResendApi({ from: env.SMTP_FROM, to, subject, html });
      return;
    }

    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });
  }
  static sendVerificationEmail(emailData: SendVerificationEmail) {
    const { html, subject } = emailVerificationTemplate(emailData.firstName, emailData.code);
    return this.sendMail({
      ...emailData,
      subject,
      html,
    });
  }
  static sendWelcomeEmail(emailData: SendWelcome) {
    const { html, subject } = welcomeTemplate(emailData.firstName);
    return this.sendMail({
      ...emailData,
      subject,
      html,
    });
  }
  static sendResetPasswordEmail(emailData: SendResetPassword) {
    const { html, subject } = passwordResetTemplate(emailData.firstName, emailData.resetUrl);
    return this.sendMail({
      ...emailData,
      subject,
      html,
    });
  }
}
