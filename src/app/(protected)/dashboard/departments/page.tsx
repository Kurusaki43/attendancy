import { getAllDepartmentsAction } from '@/features/departments';
import { AddDepartmentDialog } from '@/features/departments/components/AddDepartmentDialog';
import { DepartmentsTable } from '@/features/departments/components/DepartmentsTable';

export default async function DepartmentsPage() {
  const result = await getAllDepartmentsAction();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your organisation&apos;s departments and their status.
          </p>
        </div>
        <AddDepartmentDialog />
      </div>

      {/* Content */}
      {result.success ? (
        <DepartmentsTable departments={result.data} />
      ) : (
        <div className="bg-destructive/5 border-destructive/20 rounded-md border px-4 py-3">
          <p className="text-destructive text-sm font-medium">
            {result.message ?? 'Failed to load departments.'}
          </p>
        </div>
      )}
    </div>
  );
}
