'use client';

import { MailIcon, PencilIcon, Trash } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { TableRowActions } from '@/components/shared/data-table/TableRowActions';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { resendEmployeeInviteAction } from '@/server/employees/actions/resend-employee-invite.action';
import type { EmployeeResult } from '@/server/employees/types/action-results';

import { DeleteEmployeeDialog } from './DeleteEmployeeDialog';

export function EmployeeRowActions({ employee }: { employee: EmployeeResult }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isResending, startResendTransition] = useTransition();
  const employeeName = `${employee.user.firstName} ${employee.user.lastName}`;

  const handleResendInvite = () => {
    startResendTransition(async () => {
      const result = await resendEmployeeInviteAction(employee.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  };

  return (
    <>
      <TableRowActions label={`Actions for ${employeeName}`}>
        <DropdownMenuItem
          className="cursor-pointer px-1"
          render={<Link href={`/dashboard/employees/${employee.id}/edit`} />}
        >
          <PencilIcon />
          Edit
        </DropdownMenuItem>
        {employee.user.status === 'INVITED' && (
          <DropdownMenuItem
            className="cursor-pointer px-1 whitespace-nowrap"
            disabled={isResending}
            onClick={handleResendInvite}
          >
            <MailIcon />
            {isResending ? 'Resending...' : 'Resend Invite'}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer px-1"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </TableRowActions>

      <DeleteEmployeeDialog employee={employee} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}
