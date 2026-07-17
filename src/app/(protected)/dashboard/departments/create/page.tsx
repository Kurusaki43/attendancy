import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CreateDepartmentForm } from '@/features/departments/components/CreateDepartmentForm';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';

// Parent-department select options — active records only, capped at the max page size.
const PARENT_OPTIONS_QUERY = { limit: '100', isActive: 'true', sort: 'name' };

export default async function CreateDepartmentPage() {
  const parentDepartmentsResult = await getAllDepartmentsAction(PARENT_OPTIONS_QUERY);

  const parentOptions = parentDepartmentsResult.success
    ? parentDepartmentsResult.data.departments.map((department) => ({
        id: department.id,
        label: department.name,
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
          render={<Link href="/dashboard/departments" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Back to Departments
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add Department</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Create a new department to organize your company structure.
        </p>
      </div>

      <CreateDepartmentForm parentOptions={parentOptions} />
    </div>
  );
}
