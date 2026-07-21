import type { GenerateDailyAttendancePayload } from '@/server/attendance/services/generate-daily-attendance.service';
import type {
  SendEmployeeInvite,
  SendResetPassword,
  SendVerificationEmail,
  SendWelcome,
} from '@/server/mail/services/mail.service';

export interface JobMap {
  email: {
    'send-verification-email': SendVerificationEmail;
    'send-welcome': SendWelcome;
    'send-reset-password': SendResetPassword;
    'send-employee-invite': SendEmployeeInvite;
  };
  attendance: {
    'generate-daily-attendance': GenerateDailyAttendancePayload;
  };
}
