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

  it('counts total employees and active employees (employmentStatus ACTIVE and user.status ACTIVE)', () => {
    const overview = computeDepartmentOverview(
      [
        {
          employmentStatus: 'ACTIVE',
          user: { status: 'ACTIVE' },
          positionId: null,
          managerId: null,
        },
        {
          employmentStatus: 'ACTIVE',
          user: { status: 'ACTIVE' },
          positionId: null,
          managerId: null,
        },
        {
          employmentStatus: 'TERMINATED',
          user: { status: 'ACTIVE' },
          positionId: null,
          managerId: null,
        },
        {
          employmentStatus: 'TERMINATED',
          user: { status: 'ACTIVE' },
          positionId: null,
          managerId: null,
        },
      ],
      0,
    );

    expect(overview.totalEmployees).toBe(4);
    expect(overview.activeEmployees).toBe(2);
  });

  it('does not count an employee as active when employmentStatus is ACTIVE but the account is not', () => {
    const overview = computeDepartmentOverview(
      [
        {
          employmentStatus: 'ACTIVE',
          user: { status: 'SUSPENDED' },
          positionId: null,
          managerId: null,
        },
        {
          employmentStatus: 'ACTIVE',
          user: { status: 'INACTIVE' },
          positionId: null,
          managerId: null,
        },
        {
          employmentStatus: 'ACTIVE',
          user: { status: 'INVITED' },
          positionId: null,
          managerId: null,
        },
      ],
      0,
    );

    expect(overview.activeEmployees).toBe(0);
  });

  it('passes through the given sub-department count', () => {
    const overview = computeDepartmentOverview([], 4);

    expect(overview.childrenCount).toBe(4);
  });

  it('counts distinct positions and managers, ignoring nulls', () => {
    const overview = computeDepartmentOverview(
      [
        {
          employmentStatus: 'ACTIVE',
          user: { status: 'ACTIVE' },
          positionId: 'pos-1',
          managerId: 'mgr-1',
        },
        {
          employmentStatus: 'ACTIVE',
          user: { status: 'ACTIVE' },
          positionId: 'pos-1',
          managerId: 'mgr-2',
        },
        {
          employmentStatus: 'ACTIVE',
          user: { status: 'ACTIVE' },
          positionId: 'pos-2',
          managerId: null,
        },
        {
          employmentStatus: 'ACTIVE',
          user: { status: 'ACTIVE' },
          positionId: null,
          managerId: null,
        },
      ],
      0,
    );

    expect(overview.positionCount).toBe(2);
    expect(overview.managerCount).toBe(2);
  });
});
