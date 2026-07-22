import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { EmployeeForm } from '@/features/employees/components/EmployeeForm';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';
import { getAllEmployeesAction } from '@/server/employees/actions/get-all-employees.action';
import { getEmployeeAction } from '@/server/employees/actions/get-employee.action';
import { getAllPositionsAction } from '@/server/positions/actions/get-all-positions.action';

// Select options for the form — active records only, capped at the max page size.
const OPTIONS_QUERY = { limit: '100', isActive: 'true' };

type EditEmployeePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditEmployeePage({ params }: EditEmployeePageProps) {
  const { id } = await params;

  const [employeeResult, departmentsResult, positionsResult, managersResult] = await Promise.all([
    getEmployeeAction(id),
    getAllDepartmentsAction({ ...OPTIONS_QUERY, sort: 'name' }),
    getAllPositionsAction({ ...OPTIONS_QUERY, sort: 'title' }),
    getAllEmployeesAction(OPTIONS_QUERY),
  ]);

  if (!employeeResult.success) {
    notFound();
  }

  const employee = employeeResult.data;

  const departments = departmentsResult.success
    ? departmentsResult.data.departments
        // Employees can only be assigned to leaf departments (no sub-departments).
        .filter((department) => (department.children?.length ?? 0) === 0)
        .map((department) => ({
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
    ? managersResult.data.employees.map((candidate) => ({
        id: candidate.id,
        label: `${candidate.user.firstName} ${candidate.user.lastName}`,
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
        <h1 className="text-2xl font-semibold tracking-tight">Edit Employee</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Update {employee.user.firstName} {employee.user.lastName}&apos;s employment information.
        </p>
      </div>

      <EmployeeForm
        mode="update"
        employee={employee}
        departments={departments}
        positions={positions}
        managers={managers}
      />
    </div>
  );
}
