import { CheckCircle2, XCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { ScanAttendanceActionResult } from '@/server/attendance/types';

type AttendanceScanResultProps =
  | { success: true; data: ScanAttendanceActionResult }
  | { success: false; title: string; description: string };

function formatWorkedTime(workedMinutes: number) {
  const hours = Math.floor(workedMinutes / 60);
  const minutes = workedMinutes % 60;

  if (hours === 0) return `${minutes}m`;

  return `${hours}h ${minutes}m`;
}

export function AttendanceScanResult(props: AttendanceScanResultProps) {
  if (!props.success) {
    return (
      <Card className="mx-auto max-w-sm shadow-sm">
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <div className="bg-destructive/10 mb-1 flex size-14 items-center justify-center rounded-full">
            <XCircle className="text-destructive size-7" strokeWidth={1.5} />
          </div>
          <p className="text-foreground text-base font-semibold">{props.title}</p>
          <p className="text-muted-foreground text-sm text-balance">{props.description}</p>
        </CardContent>
      </Card>
    );
  }

  const { eventType, occurredAt, workedMinutes } = props.data;
  const isClockIn = eventType === 'CLOCK_IN';

  return (
    <Card className="mx-auto max-w-sm shadow-sm">
      <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
        <div className="bg-primary/10 mb-1 flex size-14 items-center justify-center rounded-full">
          <CheckCircle2 className="text-primary size-7" strokeWidth={1.5} />
        </div>
        <p className="text-foreground text-base font-semibold">
          {isClockIn ? "You're clocked in" : "You're clocked out"}
        </p>
        <p className="text-muted-foreground text-sm" suppressHydrationWarning>
          {occurredAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
        </p>
        {!isClockIn && (
          <p className="text-muted-foreground text-xs">
            Worked {formatWorkedTime(workedMinutes)} today
          </p>
        )}
      </CardContent>
    </Card>
  );
}
