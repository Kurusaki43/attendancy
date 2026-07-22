'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ErrorState } from '@/components/shared/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceTable } from '@/features/attendance/components/table/AttendanceTable';
import { DepartmentsTable } from '@/features/departments/components/table/DepartmentsTable';
import { EmployeesTable } from '@/features/employees/components/table/EmployeesTable';
import type { AttendanceResult } from '@/server/attendance/types';
import type { DepartmentResult } from '@/server/departments/types/action-results';
import type { EmployeeResult } from '@/server/employees/types/action-results';

type DepartmentDetailTabsProps = {
  departmentId: string;
  employees: EmployeeResult[] | null;
  employeesErrorCode?: string;
  attendance: AttendanceResult[] | null;
  attendanceErrorCode?: string;
  childDepartments: DepartmentResult[] | null;
  childDepartmentsErrorCode?: string;
};

const TAB_VIEW_ALL = {
  employees: {
    label: 'View All Employees',
    href: (departmentId: string) => `/dashboard/employees?departmentId=${departmentId}`,
  },
  attendance: {
    label: 'View All Attendance',
    href: (departmentId: string) => `/dashboard/attendance/all?departmentId=${departmentId}`,
  },
  children: {
    label: 'View All Departments',
    href: (departmentId: string) => `/dashboard/departments?parentId=${departmentId}`,
  },
} as const;

type TabValue = keyof typeof TAB_VIEW_ALL;

// Overrides the Tabs primitive's neutral active-state color (text + underline) with the brand
// primary color — scoped here rather than in the shared primitive since this is its only consumer.
const ACTIVE_TAB_CLASSES = 'data-active:text-primary after:bg-primary';

export function DepartmentDetailTabs({
  departmentId,
  employees,
  employeesErrorCode,
  attendance,
  attendanceErrorCode,
  childDepartments,
  childDepartmentsErrorCode,
}: DepartmentDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('employees');
  const viewAll = TAB_VIEW_ALL[activeTab];

  return (
    <Card className="bg-card border-border card-shadow">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
        <CardHeader className="flex items-center justify-between">
          <TabsList variant="line">
            <TabsTrigger value="employees" className={ACTIVE_TAB_CLASSES}>
              Employees
            </TabsTrigger>
            <TabsTrigger value="attendance" className={ACTIVE_TAB_CLASSES}>
              Attendance Summary
            </TabsTrigger>
            <TabsTrigger value="children" className={ACTIVE_TAB_CLASSES}>
              Sub-departments
            </TabsTrigger>
          </TabsList>

          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
            nativeButton={false}
            render={<Link href={viewAll.href(departmentId)} />}
          >
            {viewAll.label}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardHeader>

        <CardContent>
          <TabsContent value="employees">
            {employees ? (
              <EmployeesTable
                employees={employees}
                emptyMessage="This department has no employees yet."
                emptyDescription="Visit the Employees page to assign employees to this department."
                showDepartment={false}
                showActions={false}
              />
            ) : (
              <ErrorState
                title="Couldn't load employees"
                description={
                  employeesErrorCode === 'FORBIDDEN'
                    ? "You don't have permission to view this department's employees."
                    : "Something went wrong while fetching this department's employees."
                }
              />
            )}
          </TabsContent>

          <TabsContent value="attendance">
            {attendance ? (
              <AttendanceTable
                attendance={attendance}
                emptyMessage="No employee attendance has been recorded for this department."
                emptyDescription="Attendance data will appear here once employees in this department start checking in."
                showDepartment={false}
                showActions={false}
              />
            ) : (
              <ErrorState
                title="Couldn't load attendance"
                description={
                  attendanceErrorCode === 'FORBIDDEN'
                    ? "You don't have permission to view this department's attendance."
                    : "Something went wrong while fetching this department's attendance."
                }
              />
            )}
          </TabsContent>

          <TabsContent value="children">
            {childDepartments ? (
              <DepartmentsTable
                departments={childDepartments}
                emptyMessage="This department has no sub-departments yet."
                emptyDescription="Sub-departments created under this department will appear here."
                showParent={false}
                showActions={false}
              />
            ) : (
              <ErrorState
                title="Couldn't load sub-departments"
                description={
                  childDepartmentsErrorCode === 'FORBIDDEN'
                    ? "You don't have permission to view this department's sub-departments."
                    : "Something went wrong while fetching this department's sub-departments."
                }
              />
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
