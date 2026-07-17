export function employeeInviteTemplate(firstName: string, inviteUrl: string) {
  return {
    subject: "You've been invited to Attendancy 👋",

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
          An account has been created for you. Click the button below to set your
          password and activate your account:
        </p>

        <div style="margin: 32px 0; text-align: center;">
          <a
            href="${inviteUrl}"
            style="
              display: inline-block;
              padding: 14px 28px;
              background: #111827;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
            "
          >
            Set Your Password
          </a>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          This link will expire in <strong>7 days</strong>.
        </p>

        <p style="font-size: 14px; color: #6b7280;">
          If the button doesn't work, copy and paste the following URL into your browser:
        </p>

        <p
          style="
            word-break: break-all;
            font-size: 13px;
            color: #2563eb;
          "
        >
          ${inviteUrl}
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
