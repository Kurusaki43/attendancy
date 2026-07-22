import { describe, expect, it } from 'vitest';

import { computeDepartmentOverview } from '../../lib/compute-department-overview';

describe('computeDepartmentOverview', () => {
  it('returns zeroed counts for an empty department with no sub-departments', () => {
    const overview = computeDepartmentOverview([], 0);

    expect(overview).toEqual({
      totalEmployees: 0,
      activeEmployees: 0,
      childrenCount: 0,
      positionCount: 0,
      managerCount: 0,
    });
  });

  it('counts total and active employees', () => {
    const overview = computeDepartmentOverview(
      [
        { employmentStatus: 'ACTIVE', positionId: null, managerId: null },
        { employmentStatus: 'ACTIVE', positionId: null, managerId: null },
        { employmentStatus: 'ON_LEAVE', positionId: null, managerId: null },
        { employmentStatus: 'TERMINATED', positionId: null, managerId: null },
      ],
      0,
    );

    expect(overview.totalEmployees).toBe(4);
    expect(overview.activeEmployees).toBe(2);
  });

  it('passes through the given sub-department count', () => {
    const overview = computeDepartmentOverview([], 4);

    expect(overview.childrenCount).toBe(4);
  });

  it('counts distinct positions and managers, ignoring nulls', () => {
    const overview = computeDepartmentOverview(
      [
        { employmentStatus: 'ACTIVE', positionId: 'pos-1', managerId: 'mgr-1' },
        { employmentStatus: 'ACTIVE', positionId: 'pos-1', managerId: 'mgr-2' },
        { employmentStatus: 'ACTIVE', positionId: 'pos-2', managerId: null },
        { employmentStatus: 'ACTIVE', positionId: null, managerId: null },
      ],
      0,
    );

    expect(overview.positionCount).toBe(2);
    expect(overview.managerCount).toBe(2);
  });
});
