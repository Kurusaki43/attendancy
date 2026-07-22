type EmployeeForOverview = {
  employmentStatus: 'ACTIVE' | 'TERMINATED';
  user: { status: 'ACTIVE' | 'INACTIVE' | 'INVITED' | 'SUSPENDED' };
  positionId: string | null;
  managerId: string | null;
};

export type DepartmentOverview = {
  totalEmployees: number;
  activeEmployees: number;
  childrenCount: number;
  positionCount: number;
  managerCount: number;
};

export function computeDepartmentOverview(
  employees: EmployeeForOverview[],
  childrenCount: number,
): DepartmentOverview {
  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(
      (employee) => employee.employmentStatus === 'ACTIVE' && employee.user.status === 'ACTIVE',
    ).length,
    childrenCount,
    positionCount: new Set(employees.map((employee) => employee.positionId).filter(Boolean)).size,
    managerCount: new Set(employees.map((employee) => employee.managerId).filter(Boolean)).size,
  };
}
