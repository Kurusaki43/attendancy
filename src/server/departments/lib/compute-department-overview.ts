type EmployeeForOverview = {
  positionId: string | null;
  managerId: string | null;
};

export type DepartmentOverview = {
  totalEmployees: number;
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
    childrenCount,
    positionCount: new Set(employees.map((employee) => employee.positionId).filter(Boolean)).size,
    managerCount: new Set(employees.map((employee) => employee.managerId).filter(Boolean)).size,
  };
}
