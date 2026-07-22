import type { LucideIcon } from 'lucide-react';
import { Fingerprint, QrCode, ScanFace, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  ATTENDANCE_METHOD_BADGE_CLASSES,
  ATTENDANCE_METHOD_LABELS,
  type AttendanceMethod,
} from '@/features/attendance/lib/attendance-status';
import { cn } from '@/lib/utils';

const ATTENDANCE_METHOD_ICONS: Record<AttendanceMethod, LucideIcon> = {
  QR: QrCode,
  FACE: ScanFace,
  FINGERPRINT: Fingerprint,
  MANUAL: User,
};

type AttendanceMethodBadgeProps = {
  method: AttendanceMethod;
  className?: string;
};

export function AttendanceMethodBadge({ method, className }: AttendanceMethodBadgeProps) {
  const Icon = ATTENDANCE_METHOD_ICONS[method];

  return (
    <Badge className={cn('rounded-sm', ATTENDANCE_METHOD_BADGE_CLASSES[method], className)}>
      <Icon className="size-3" />
      {ATTENDANCE_METHOD_LABELS[method]}
    </Badge>
  );
}
