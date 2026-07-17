'use client';

import { Handle, type NodeProps, Position } from '@xyflow/react';
import { Building2, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { DepartmentNode } from '../lib/department-hierarchy-layout';
import { DEPARTMENT_ICON_MAP } from '../lib/department-visuals';

export function DepartmentFlowNode({ data }: NodeProps<DepartmentNode>) {
  const { department } = data;
  const Icon = (department.icon && DEPARTMENT_ICON_MAP.get(department.icon)) || Building2;

  return (
    <div className="bg-card hover:border-primary/50 w-60 rounded-lg border p-3 shadow-sm transition-colors">
      <Handle type="target" position={Position.Top} isConnectable={false} className="opacity-0" />

      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-md text-white',
            department.color || 'bg-muted text-muted-foreground',
          )}
        >
          {/* Icon is always one of a fixed set of module-level lucide-react components resolved
          by key from DEPARTMENT_ICON_MAP — never freshly created — so this is safe. */}
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-medium">{department.name}</p>
          <p className="text-muted-foreground font-mono text-xs">{department.code}</p>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <Users className="size-3" />
          {department.employeeCount ?? 0}
        </span>
        {department.isActive ? (
          <Badge className="bg-green-500/15 text-[10px] text-green-700 dark:bg-green-500/20 dark:text-green-400">
            Active
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-[10px]">
            Inactive
          </Badge>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        className="opacity-0"
      />
    </div>
  );
}
