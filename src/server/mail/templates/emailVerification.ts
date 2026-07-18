export function emailVerificationTemplate(firstName: string, code: string, expiresIn: string) {
  return {
    subject: 'Verify your email address ✉️',

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
          Welcome to Attendancy 👋
        </h1>

        <p style="font-size: 14px; line-height: 1.6;">
          Hi <strong>${firstName}</strong>,
        </p>

        <p style="font-size: 14px; line-height: 1.6;">
          Thanks for creating your account. Please verify your email address using the code below:
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
          This code will expire in <strong>${expiresIn}</strong>.
        </p>

        <p style="font-size: 14px; color: #6b7280;">
          If you didn't create this account, you can safely ignore this email.
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
