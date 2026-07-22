type DepartmentForHierarchy = {
  id: string;
  parentId: string | null;
};

/**
 * Returns the given department's id together with every descendant's id, recursively. Employees
 * can only be assigned to leaf departments, so a department with children has none of its own —
 * callers that need to aggregate department-scoped data (attendance, headcount, ...) should query
 * against this full set instead of the single id. For a leaf department (no children), this
 * collapses to `[departmentId]`, so callers don't need to branch on leaf vs. non-leaf themselves.
 */
export function collectDepartmentAndDescendantIds(
  departmentId: string,
  departments: DepartmentForHierarchy[],
): string[] {
  const childIdsByParentId = new Map<string, string[]>();

  departments.forEach((department) => {
    if (!department.parentId) return;
    const siblingIds = childIdsByParentId.get(department.parentId) ?? [];
    siblingIds.push(department.id);
    childIdsByParentId.set(department.parentId, siblingIds);
  });

  const ids: string[] = [];

  function collect(id: string) {
    ids.push(id);
    const childIds = childIdsByParentId.get(id) ?? [];
    childIds.forEach(collect);
  }

  collect(departmentId);

  return ids;
}
