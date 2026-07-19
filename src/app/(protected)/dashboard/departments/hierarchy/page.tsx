import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import { ErrorState } from '@/components/shared/ErrorState';
import { Button } from '@/components/ui/button';
import { DepartmentHierarchy } from '@/features/departments/components/DepartmentHierarchy';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';

// Every department, in one page — the tree is laid out client-side from parentId.
// 100 is the query schema's max page size (BaseQuerySchema).
const ALL_DEPARTMENTS_QUERY = { limit: '100', sort: 'name' };

export default async function DepartmentHierarchyPage() {
  const result = await getAllDepartmentsAction(ALL_DEPARTMENTS_QUERY);

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
        <h1 className="text-2xl font-semibold tracking-tight">Department Hierarchy</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Explore how departments are organized. Click a department to edit it.
        </p>
      </div>

      {result.success ? (
        <DepartmentHierarchy departments={result.data.departments} />
      ) : (
        <ErrorState
          {...getListErrorStateProps(result.code, { resourceLabel: 'departments' })}
          className="border-border bg-card card-shadow rounded-sm"
        />
      )}
    </div>
  );
}
