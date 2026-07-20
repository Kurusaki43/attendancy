'use client';

import { Clock, ScanLine } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAttendanceQrAction } from '@/server/attendance/actions/get-attendance-qr.action';
import type { GetAttendanceQrActionResult } from '@/server/attendance/types';
import { formatDate, TIME_FORMAT } from '@/shared/utils/format-date';

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
    <Card className="card-shadow border-border mx-auto w-full max-w-sm rounded-lg">
      <CardHeader className="text-center">
        <span className="bg-primary/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
          <ScanLine className="text-primary size-5" />
        </span>
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
            className="block object-cover"
          />
        </div>

        <p
          className="text-muted-foreground flex items-center gap-2 text-xs"
          suppressHydrationWarning
        >
          <Clock size={12} className="text-primary" />
          Last refreshed at{' '}
          {formatDate(qr.issuedAt, { locale: qr.locale, timezone: qr.timezone, ...TIME_FORMAT })}
        </p>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </CardContent>
    </Card>
  );
}
