'use client';

import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function AttendanceScanQrButton() {
  const router = useRouter();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleClick = async () => {
    setIsRequesting(true);

    try {
      // Only requesting access here to surface the browser's permission prompt up front — the
      // scanner page opens its own stream once we get there, which the browser won't re-prompt
      // for since permission is already granted at that point.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      stream.getTracks().forEach((track) => track.stop());

      router.push('/scan-qr');
    } catch {
      toast.error('Camera access is required to scan the QR code.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Button
      type="button"
      className="w-full font-semibold sm:w-auto"
      disabled={isRequesting}
      onClick={handleClick}
    >
      <Camera data-icon="inline-start" />
      {isRequesting ? 'Requesting camera...' : 'Scan QR'}
    </Button>
  );
}
