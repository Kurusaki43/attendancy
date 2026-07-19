import { Camera } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import { ErrorState } from '@/components/shared/ErrorState';
import { AttendanceQrDisplay } from '@/features/attendance/components/AttendanceQrDisplay';
import { getAttendanceQrAction } from '@/server/attendance/actions/get-attendance-qr.action';

// Deliberately outside the dashboard layout — this is meant to be shown full-screen on a
// reception/kiosk display, so it must not render the sidebar or any other admin navigation.
export default async function AttendanceQrPage() {
  const result = await getAttendanceQrAction();

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="flex items-center justify-center gap-3 py-6">
        <div className="bg-primary flex size-9 items-center justify-center rounded-lg shadow-sm">
          <span className="text-primary-foreground text-sm font-bold">A</span>
        </div>
        <div>
          <p className="text-lg font-semibold tracking-wide">Attendancy</p>
          <p className="text-muted-foreground text-xs">Employee Check-In</p>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 px-3">
        {result.success ? (
          <AttendanceQrDisplay initialQr={result.data} />
        ) : (
          <ErrorState
            {...getListErrorStateProps(result.code, { resourceLabel: 'attendance QR code' })}
            className="border-border bg-card card-shadow rounded-sm"
          />
        )}
      </main>

      <footer className="text-muted-foreground flex items-center justify-center gap-5 border-t px-6 py-4 text-xs">
        <span className="bg-primary/10 flex size-8 shrink-0 items-center justify-center self-start rounded-full">
          <Camera size={14} className="text-primary" />
        </span>
        <div className="text-center">
          <p>Open your phone&apos;s camera and point it at the code to check in or out.</p>
          <p className="mt-1 font-bold">{today}</p>
        </div>
      </footer>
    </div>
  );
}
