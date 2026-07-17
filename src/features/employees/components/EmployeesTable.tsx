'use client';

import { SearchX } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { type ColumnDef, DataTable } from '@/components/shared/data-table/DataTable';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
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
        <div>
          <span className="text-foreground block font-medium">
            {row.user.firstName} {row.user.lastName}
          </span>
          <span className="text-muted-foreground text-xs">{row.user.email}</span>
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
        <span className="text-muted-foreground tabular-nums">
          {new Date(row.hireDate).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
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
        <div className="flex gap-2">
          <EditEmployeeDialog
            employee={row}
            departments={departments}
            positions={positions}
            managers={managers}
          />
          <DeleteEmployeeDialog employee={row} />
        </div>
      ),
      cellClassName: 'text-right',
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
      className="border"
    />
  );
}
