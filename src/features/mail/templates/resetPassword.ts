export function passwordResetTemplate(firstName: string, code: string) {
  return {
    subject: 'Reset your password 🔐',

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 32px;
          color: #111827;
        "
      >
        <h1 style="margin-bottom: 24px;">
          Password reset request 🔐
        </h1>

        <p style="font-size: 14px; line-height: 1.6;">
          Hi <strong>${firstName}</strong>,
        </p>

        <p style="font-size: 14px; line-height: 1.6;">
          We received a request to reset your password.
        </p>

        <p style="font-size: 14px; line-height: 1.6;">
          Use the verification code below to continue:
        </p>

        <div
          style="
            margin: 32px 0;
            padding: 16px;
            background: #111827;
            color: #ffffff;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 8px;
            border-radius: 8px;
          "
        >
          ${code}
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          This code will expire in <strong>15 minutes</strong>.
        </p>

        <p style="font-size: 14px; color: #6b7280;">
          If you didn't request a password reset, you can safely ignore this
          email. Your password will remain unchanged.
        </p>

        <hr
          style="
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 32px 0;
          "
        />

        <p style="font-size: 12px; color: #9ca3af;">
          © 2026 Attendancy. All rights reserved.
        </p>
      </div>
    `,
  };
}
