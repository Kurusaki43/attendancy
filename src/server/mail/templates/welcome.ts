export function welcomeTemplate(firstName: string) {
  return {
    subject: 'Welcome to Attendancy 🎉',

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
          Welcome aboard, ${firstName}! 🎉
        </h1>

        <p style="font-size: 14px; line-height: 1.6;">
          Hi <strong>${firstName}</strong>,
        </p>

        <p style="font-size: 14px; line-height: 1.6;">
          Your account has been successfully verified and activated.
        </p>

        <p style="font-size: 14px; line-height: 1.6;">
          You can now access all features of Attendancy and start managing
          your attendance, schedules, and work activities.
        </p>

        <div
          style="
            margin: 32px 0;
            padding: 20px;
            background: #f3f4f6;
            border-radius: 8px;
            text-align: center;
          "
        >
          <span
            style="
              font-size: 16px;
              font-weight: bold;
              color: #111827;
            "
          >
            🚀 You're ready to get started!
          </span>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          If you have any questions, feel free to contact our support team.
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
