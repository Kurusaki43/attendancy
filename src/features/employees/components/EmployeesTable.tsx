'use client';

import { PencilIcon, SearchX, Trash } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { type ColumnDef, DataTable } from '@/components/shared/data-table/DataTable';
import { TableRowActions } from '@/components/shared/data-table/TableRowActions';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import { updateEmployeeAction } from '@/server/employees/actions/update-employee.action';
import type { EmployeeResult } from '@/server/employees/types/action-results';

import { DeleteEmployeeDialog } from './DeleteEmployeeDialog';
import { EditEmployeeDialog } from './EditEmployeeDialog';

type SelectOption = { id: string; label: string };

function StatusSwitch({ id, name, isActive }: { id: string; name: string; isActive: boolean }) {
  const [checked, setChecked] = useState(isActive);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    const nextValue = !checked;

    // Optimistic update
    setChecked(nextValue);

    startTransition(async () => {
      const result = await updateEmployeeAction(id, {
        isActive: nextValue,
      });

      if (!result.success) {
        setChecked(!nextValue);

        toast.error(`Failed to ${nextValue ? 'activate' : 'deactivate'} ${name}`);

        return;
      }

      toast.success(`${name} ${nextValue ? 'activated' : 'deactivated'} successfully`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={handleToggleStatus}
        disabled={isPending}
        className="select-none"
      />

      {isPending && <Spinner />}
    </div>
  );
}

function RowActions({
  employee,
  departments,
  positions,
  managers,
}: {
  employee: EmployeeResult;
  departments: SelectOption[];
  positions: SelectOption[];
  managers: SelectOption[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const employeeName = `${employee.user.firstName} ${employee.user.lastName}`;

  return (
    <>
      <TableRowActions label={`Actions for ${employeeName}`}>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setEditOpen(true)}>
          <PencilIcon />
          Edit
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

      <EditEmployeeDialog
        employee={employee}
        departments={departments}
        positions={positions}
        managers={managers}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteEmployeeDialog employee={employee} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}

function buildColumns(
  departments: SelectOption[],
  positions: SelectOption[],
  managers: SelectOption[],
): ColumnDef<EmployeeResult>[] {
  return [
    {
      key: 'name',
      header: 'Employee',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <UserAvatar
            firstName={row.user.firstName}
            lastName={row.user.lastName}
            avatar={row.user.avatar}
          />
          <div>
            <span className="text-foreground block font-medium">
              {row.user.firstName} {row.user.lastName}
            </span>
            <span className="text-muted-foreground text-xs">{row.user.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeCode',
      header: 'Code',
      cell: (row) => (
        <span className="text-muted-foreground font-mono text-xs">{row.employeeCode}</span>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      cell: (row) => (
        <span className="text-muted-foreground">
          {row.department?.name ?? <span className="italic opacity-50">None</span>}
        </span>
      ),
    },
    {
      key: 'position',
      header: 'Position',
      cell: (row) => (
        <span className="text-muted-foreground">
          {row.position?.title ?? <span className="italic opacity-50">None</span>}
        </span>
      ),
    },
    {
      key: 'manager',
      header: 'Manager',
      cell: (row) => (
        <span className="text-muted-foreground">
          {row.manager ? (
            `${row.manager.user.firstName} ${row.manager.user.lastName}`
          ) : (
            <span className="italic opacity-50">None</span>
          )}
        </span>
      ),
    },
    {
      key: 'hireDate',
      header: 'Hired',
      cell: (row) => (
        <span className="text-muted-foreground block text-center tabular-nums">
          {new Date(row.hireDate).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
      headerClassName: 'text-center',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <StatusSwitch
          id={row.id}
          name={`${row.user.firstName} ${row.user.lastName}`}
          isActive={row.isActive}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <RowActions
          employee={row}
          departments={departments}
          positions={positions}
          managers={managers}
        />
      ),
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    },
  ];
}

type EmployeesTableProps = {
  employees: EmployeeResult[];
  departments: SelectOption[];
  positions: SelectOption[];
  managers: SelectOption[];
};

export function EmployeesTable({
  employees,
  departments,
  positions,
  managers,
}: EmployeesTableProps) {
  return (
    <DataTable
      data={employees}
      columns={buildColumns(departments, positions, managers)}
      emptyMessage="No matching employees"
      emptyDescription="Try adjusting your search or filters."
      emptyIcon={SearchX}
      emptyAction={<ClearFiltersButton />}
      getRowKey={(row) => row.id}
    />
  );
}
