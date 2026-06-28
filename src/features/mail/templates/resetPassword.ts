export function resetPasswordTemplate(token: string) {
  return {
    subject: 'Reset your password 🔐',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Password Reset Request</h2>

        <p style="font-size: 14px;">
          We received a request to reset your password.
        </p>

        <p style="font-size: 14px;">
          Use the token below to reset it:
        </p>

        <div style="
          margin: 20px 0;
          padding: 12px;
          background: #111;
          color: #fff;
          font-size: 16px;
          text-align: center;
          border-radius: 6px;
          letter-spacing: 2px;
        ">
          ${token}
        </div>

        <p style="font-size: 12px; color: #666;">
          This token will expire in 15 minutes.
        </p>
      </div>
    `,
  };
}
