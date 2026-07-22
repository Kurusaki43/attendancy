'use client';

import { useRouter } from 'next/navigation';
import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

function extractToken(decodedText: string): string | null {
  try {
    return new URL(decodedText).searchParams.get('token');
  } catch {
    return null;
  }
}

export function AttendanceQrScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let hasScanned = false;

    const scanner = new QrScanner(
      videoElement,
      (result) => {
        if (hasScanned) return;

        const token = extractToken(result.data);
        if (!token) return;

        hasScanned = true;
        scanner.stop();
        router.push(`/attendance-scan?token=${encodeURIComponent(token)}`);
      },
      {
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
      },
    );

    scanner
      .start()
      .catch(() =>
        setError('Unable to access the camera. Check your browser permissions and try again.'),
      );

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [router]);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div className={cn('bg-muted relative w-full overflow-hidden rounded-lg', error && 'hidden')}>
        <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />
      </div>

      {error ? (
        <p className="text-destructive text-center text-sm">{error}</p>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          Point your camera at the check-in QR code.
        </p>
      )}
    </div>
  );
}
