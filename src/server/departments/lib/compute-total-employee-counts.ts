type DepartmentForRollup = {
  id: string;
  parentId: string | null;
  employeeCount: number;
};

/**
 * Sums each department's own employeeCount with every descendant's, so a parent department's
 * total reflects its full team headcount instead of just the (normally zero, since employees can
 * only be assigned to leaf departments) count on the parent row itself.
 */
export function computeTotalEmployeeCounts(
  departments: DepartmentForRollup[],
): Map<string, number> {
  const childIdsByParentId = new Map<string, string[]>();
  const departmentsById = new Map(departments.map((department) => [department.id, department]));

  departments.forEach((department) => {
    if (!department.parentId) return;
    const siblingIds = childIdsByParentId.get(department.parentId) ?? [];
    siblingIds.push(department.id);
    childIdsByParentId.set(department.parentId, siblingIds);
  });

  const totals = new Map<string, number>();

  function computeTotal(department: DepartmentForRollup): number {
    const cached = totals.get(department.id);
    if (cached !== undefined) return cached;

    const childIds = childIdsByParentId.get(department.id) ?? [];
    const childrenTotal = childIds.reduce((sum, childId) => {
      const child = departmentsById.get(childId);
      return sum + (child ? computeTotal(child) : 0);
    }, 0);

    const total = department.employeeCount + childrenTotal;
    totals.set(department.id, total);
    return total;
  }

  departments.forEach((department) => computeTotal(department));

  return totals;
}
