import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { EmployeeForm } from '@/features/employees/components/EmployeeForm';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';
import { getAllEmployeesAction } from '@/server/employees/actions/get-all-employees.action';
import { getAllPositionsAction } from '@/server/positions/actions/get-all-positions.action';

// Select options for the form — active records only, capped at the max page size.
const OPTIONS_QUERY = { limit: '100', isActive: 'true' };

export default async function CreateEmployeePage() {
  const [departmentsResult, positionsResult, managersResult] = await Promise.all([
    getAllDepartmentsAction({ ...OPTIONS_QUERY, sort: 'name' }),
    getAllPositionsAction({ ...OPTIONS_QUERY, sort: 'title' }),
    getAllEmployeesAction(OPTIONS_QUERY),
  ]);

  const departments = departmentsResult.success
    ? departmentsResult.data.departments.map((department) => ({
        id: department.id,
        label: department.name,
      }))
    : [];
  const positions = positionsResult.success
    ? positionsResult.data.positions.map((position) => ({
        id: position.id,
        label: position.title,
      }))
    : [];
  const managers = managersResult.success
    ? managersResult.data.employees.map((employee) => ({
        id: employee.id,
        label: `${employee.user.firstName} ${employee.user.lastName}`,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="text-muted-foreground -ms-2.5 mb-2"
          render={<Link href="/dashboard/employees" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Back to Employees
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add Employee</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Fill in the details to add a new employee. An account will be created and an invite email
          sent so they can set their password.
        </p>
      </div>

      <EmployeeForm
        mode="create"
        departments={departments}
        positions={positions}
        managers={managers}
      />
    </div>
  );
}
