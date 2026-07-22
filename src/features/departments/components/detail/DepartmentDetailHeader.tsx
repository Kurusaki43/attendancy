'use client';

import { ArrowLeft, ChevronDown, PencilIcon, Power, PowerOff, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteDepartmentDialog } from '@/features/departments/components/DeleteDepartmentDialog';
import { cn } from '@/lib/utils';
import { updateDepartmentAction } from '@/server/departments/actions/update-department.action';
import type { GetDepartmentDetailActionResult } from '@/server/departments/types/action-results';

type DepartmentDetailHeaderProps = {
  department: GetDepartmentDetailActionResult;
};

export function DepartmentDetailHeader({ department }: DepartmentDetailHeaderProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isToggling, startToggleTransition] = useTransition();
  const router = useRouter();

  const handleToggleActive = () => {
    startToggleTransition(async () => {
      const result = await updateDepartmentAction(department.id, {
        isActive: !department.isActive,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(
        department.isActive
          ? `"${department.name}" has been deactivated.`
          : `"${department.name}" has been activated.`,
      );
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            className="text-muted-foreground -ms-2.5 mb-2"
            render={<Link href="/dashboard/departments" />}
          >
            <ArrowLeft data-icon="inline-start" />
            Back to Departments
          </Button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight">{department.name}</h1>
            <Badge
              className={cn(
                'rounded-sm',
                department.isActive
                  ? 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'size-1.5 shrink-0 rounded-full',
                  department.isActive ? 'bg-green-500' : 'bg-muted-foreground',
                )}
              />
              {department.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage department information, members and performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/dashboard/departments/${department.code}/edit`} />}
          >
            <PencilIcon data-icon="inline-start" />
            Edit Department
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button>
                  Actions
                  <ChevronDown data-icon="inline-end" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                disabled={isToggling}
                onClick={handleToggleActive}
              >
                {department.isActive ? <PowerOff /> : <Power />}
                {department.isActive ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteDepartmentDialog
        department={department}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => router.push('/dashboard/departments')}
      />
    </>
  );
}
