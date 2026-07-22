import { Building2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DEPARTMENT_ICON_MAP } from '@/features/departments/lib/department-visuals';
import { cn } from '@/lib/utils';
import type { EmployeeResult } from '@/server/employees/types/action-results';

export function DepartmentCell({ department }: { department: EmployeeResult['department'] }) {
  if (!department) {
    return <span className="text-muted-foreground italic opacity-50">None</span>;
  }

  const Icon = (department.icon && DEPARTMENT_ICON_MAP.get(department.icon)) || Building2;

  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <span
        className={cn(
          'flex size-3.5 shrink-0 items-center justify-center rounded-sm text-white',
          department.color || 'bg-muted-foreground',
        )}
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Icon className="size-2.5" />
      </span>
      {department.name}
    </Badge>
  );
}
