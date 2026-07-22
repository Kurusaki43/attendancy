import { Cpu, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { AttendanceResult } from '@/server/attendance/types';

export function SourceBadge({
  hasManualChanges,
}: {
  hasManualChanges: AttendanceResult['hasManualChanges'];
}) {
  if (hasManualChanges) {
    return (
      <Badge className="rounded-sm bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
        <User className="size-3" />
        Manual
      </Badge>
    );
  }

  return (
    <Badge className="rounded-sm bg-slate-500/15 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400">
      <Cpu className="size-3" />
      Automatic
    </Badge>
  );
}
