import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { DepartmentForm } from '@/features/departments/components/DepartmentForm';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';
import { getDepartmentAction } from '@/server/departments/actions/get-department.action';

// Parent-department select options — active records only, capped at the max page size.
const PARENT_OPTIONS_QUERY = { limit: '100', isActive: 'true', sort: 'name' };

type EditDepartmentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDepartmentPage({ params }: EditDepartmentPageProps) {
  const { id } = await params;

  const [departmentResult, parentDepartmentsResult] = await Promise.all([
    getDepartmentAction(id),
    getAllDepartmentsAction(PARENT_OPTIONS_QUERY),
  ]);

  if (!departmentResult.success) {
    notFound();
  }

  const department = departmentResult.data;

  const parentOptions = parentDepartmentsResult.success
    ? parentDepartmentsResult.data.departments
        .filter((candidate) => candidate.id !== department.id)
        .map((candidate) => ({ id: candidate.id, label: candidate.name }))
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
        <h1 className="text-2xl font-semibold tracking-tight">Edit Department</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Update {department.name}&apos;s details.
        </p>
      </div>

      <DepartmentForm mode="update" department={department} parentOptions={parentOptions} />
    </div>
  );
}
