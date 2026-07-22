'use client';

import { EyeIcon, PencilIcon, Power, PowerOff, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { TableRowActions } from '@/components/shared/data-table/TableRowActions';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { updateDepartmentAction } from '@/server/departments/actions/update-department.action';
import type { DepartmentResult } from '@/server/departments/types/action-results';

import { DeleteDepartmentDialog } from '../DeleteDepartmentDialog';

export function DepartmentRowActions({ department }: { department: DepartmentResult }) {
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
      <TableRowActions label={`Actions for ${department.name}`}>
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href={`/dashboard/departments/${department.code}`} />}
        >
          <EyeIcon />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href={`/dashboard/departments/${department.code}/edit`} />}
        >
          <PencilIcon />
          Edit
        </DropdownMenuItem>
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
      </TableRowActions>

      <DeleteDepartmentDialog
        department={department}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
