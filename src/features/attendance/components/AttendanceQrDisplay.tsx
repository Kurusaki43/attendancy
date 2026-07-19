'use client';

import { useEffect, useRef, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAttendanceQrAction } from '@/server/attendance/actions/get-attendance-qr.action';
import type { GetAttendanceQrActionResult } from '@/server/attendance/types';

type AttendanceQrDisplayProps = {
  initialQr: GetAttendanceQrActionResult;
};

const RETRY_DELAY_MS = 3_000;

export function AttendanceQrDisplay({ initialQr }: AttendanceQrDisplayProps) {
  const [qr, setQr] = useState(initialQr);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const result = await getAttendanceQrAction();
      if (cancelled) return;

      if (result.success) {
        setError(null);
        setQr(result.data);
        timeoutRef.current = setTimeout(refresh, result.data.expiresInMs);
      } else {
        setError(result.message ?? 'Failed to refresh the QR code.');
        timeoutRef.current = setTimeout(refresh, RETRY_DELAY_MS);
      }
    }

    timeoutRef.current = setTimeout(refresh, qr.expiresInMs);

    return () => {
      cancelled = true;
      clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="mx-auto max-w-sm shadow-sm">
      <CardHeader className="text-center">
        <CardTitle>Attendance Check-In</CardTitle>
        <CardDescription>
          Scan this code to check in. It refreshes automatically every 10 seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <div className="border-border overflow-hidden border">
          {/* eslint-disable-next-line @next/next/no-img-element -- data: URL, no next/image optimization to gain */}
          <img
            src={qr.qrDataUrl}
            alt="Attendance check-in QR code"
            className="block size-72"
            width={288}
            height={288}
          />
        </div>

        <p className="text-muted-foreground text-xs" suppressHydrationWarning>
          Last refreshed at {new Date(qr.issuedAt).toLocaleTimeString()}
        </p>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </CardContent>
    </Card>
  );
}
