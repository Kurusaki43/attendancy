import { describe, expect, it } from 'vitest';

import { computeTotalEmployeeCounts } from '../../lib/compute-total-employee-counts';

describe('computeTotalEmployeeCounts', () => {
  it('returns the department own employeeCount for a leaf department', () => {
    const totals = computeTotalEmployeeCounts([{ id: 'eng', parentId: null, employeeCount: 5 }]);

    expect(totals.get('eng')).toBe(5);
  });

  it('sums a direct child into its parent total', () => {
    const totals = computeTotalEmployeeCounts([
      { id: 'eng', parentId: null, employeeCount: 0 },
      { id: 'qa', parentId: 'eng', employeeCount: 4 },
    ]);

    expect(totals.get('eng')).toBe(4);
    expect(totals.get('qa')).toBe(4);
  });

  it('rolls up multiple levels of descendants', () => {
    const totals = computeTotalEmployeeCounts([
      { id: 'eng', parentId: null, employeeCount: 0 },
      { id: 'qa', parentId: 'eng', employeeCount: 3 },
      { id: 'automation', parentId: 'qa', employeeCount: 2 },
      { id: 'rd', parentId: 'eng', employeeCount: 1 },
    ]);

    expect(totals.get('automation')).toBe(2);
    expect(totals.get('qa')).toBe(5);
    expect(totals.get('rd')).toBe(1);
    expect(totals.get('eng')).toBe(6);
  });

  it('includes the parent own employeeCount alongside its descendants', () => {
    const totals = computeTotalEmployeeCounts([
      { id: 'ops', parentId: null, employeeCount: 2 },
      { id: 'facilities', parentId: 'ops', employeeCount: 3 },
    ]);

    expect(totals.get('ops')).toBe(5);
  });

  it('ignores a parentId that does not resolve to a department in the list', () => {
    const totals = computeTotalEmployeeCounts([
      { id: 'orphan', parentId: 'missing', employeeCount: 7 },
    ]);

    expect(totals.get('orphan')).toBe(7);
  });
});
