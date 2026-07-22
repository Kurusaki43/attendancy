import { Camera, Info, QrCode } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AttendanceCheckInCard() {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>Ready to check in?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <div className="bg-primary/5 flex w-full flex-col items-center gap-4 rounded-md p-6">
          <div className="relative flex size-20 shrink-0 items-center justify-center">
            <span className="border-primary absolute top-0 left-0 size-6 rounded-tl-lg border-t-2 border-l-2" />
            <span className="border-primary absolute top-0 right-0 size-6 rounded-tr-lg border-t-2 border-r-2" />
            <span className="border-primary absolute bottom-0 left-0 size-6 rounded-bl-lg border-b-2 border-l-2" />
            <span className="border-primary absolute right-0 bottom-0 size-6 rounded-br-lg border-r-2 border-b-2" />
            <QrCode className="text-primary size-9" />
          </div>

          <div className="space-y-1">
            <p className="text-foreground text-sm font-medium">
              Scan the QR code at your workplace
            </p>
            <p className="text-muted-foreground text-xs">to check in and start your day.</p>
          </div>

          <Button type="button" className="w-full font-semibold sm:w-auto">
            <Camera data-icon="inline-start" />
            Scan QR
          </Button>
        </div>

        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Info className="size-3.5 shrink-0" />
          Make sure camera permission is allowed.
        </p>
      </CardContent>
    </Card>
  );
}
