import { Logo } from '@/components/shared/Logo';
import { AttendanceScanResult } from '@/features/attendance/components/AttendanceScanResult';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { scanAttendanceAction } from '@/server/attendance/actions/scan-attendance.action';

type Props = {
  searchParams: Promise<{ token?: string }>;
};

function errorProps(code: string | undefined, message: string | undefined) {
  switch (code) {
    case ERROR_CODES.ATTENDANCE_QR_INVALID:
      return {
        title: 'This code has expired',
        description: 'The kiosk QR code refreshes every few seconds — scan the current one.',
      };
    case ERROR_CODES.EMPLOYEE_NOT_FOUND:
      return {
        title: 'No employee profile found',
        description: "Your account isn't linked to an employee record. Contact your administrator.",
      };
    case ERROR_CODES.FORBIDDEN:
      return {
        title: "You don't have access",
        description: "Your account doesn't have permission to clock in or out.",
      };
    default:
      return {
        title: "Couldn't record attendance",
        description: message ?? 'Something went wrong. Please try scanning again.',
      };
  }
}

// Deliberately outside the dashboard layout — this is meant to be opened by scanning the kiosk
// QR with a phone camera, not navigated to from within the app shell.
export default async function AttendanceScanPage({ searchParams }: Props) {
  const { token } = await searchParams;

  const result = token
    ? await scanAttendanceAction({ token })
    : ({ success: false, code: undefined, message: 'Missing QR code.' } as const);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="flex items-center justify-center gap-3 py-8">
        <Logo size="lg" />
        <div>
          <p className="text-lg font-semibold tracking-wide">Attendancy</p>
          <p className="text-muted-foreground text-xs">Employee Check-In</p>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 px-3">
        {result.success ? (
          <AttendanceScanResult success data={result.data} />
        ) : (
          <AttendanceScanResult success={false} {...errorProps(result.code, result.message)} />
        )}
      </main>
    </div>
  );
}
