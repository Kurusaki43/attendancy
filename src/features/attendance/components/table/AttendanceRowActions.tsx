'use client';

import { EyeIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';

import { TableRowActions } from '@/components/shared/data-table/TableRowActions';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { AttendanceResult } from '@/server/attendance/types';

export function AttendanceRowActions({ attendance }: { attendance: AttendanceResult }) {
  const isEditable = attendance.status !== 'ON_LEAVE' && attendance.status !== 'HOLIDAY';

  return (
    <TableRowActions
      label={`Actions for ${attendance.employee.user.firstName} ${attendance.employee.user.lastName}`}
    >
      <DropdownMenuItem
        className="cursor-pointer"
        render={<Link href={`/dashboard/attendance/${attendance.id}`} />}
      >
        <EyeIcon />
        Preview
      </DropdownMenuItem>

      {isEditable ? (
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href={`/dashboard/attendance/${attendance.id}/edit`} />}
        >
          <PencilIcon />
          Edit
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem disabled>
          <PencilIcon />
          Edit
        </DropdownMenuItem>
      )}
    </TableRowActions>
  );
}
