export function welcomeEmailTemplate(name: string) {
  return {
    subject: 'Welcome to Attendance App 👋',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #111;">Welcome ${name} 👋</h2>

        <p style="font-size: 14px; color: #444;">
          Your account has been created successfully.
        </p>

        <div style="margin-top: 20px; padding: 12px; background: #f5f5f5; border-radius: 6px;">
          <p style="margin: 0; font-size: 13px;">
            You can now log in and start using the attendance system.
          </p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">
          If you didn’t request this account, you can ignore this email.
        </p>
      </div>
    `,
  };
}
