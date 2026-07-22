import { describe, expect, it } from 'vitest';

import { collectDepartmentAndDescendantIds } from '../../lib/collect-department-descendant-ids';

describe('collectDepartmentAndDescendantIds', () => {
  it('returns just the department itself when it has no children', () => {
    const ids = collectDepartmentAndDescendantIds('eng', [{ id: 'eng', parentId: null }]);

    expect(ids).toEqual(['eng']);
  });

  it('includes a direct child alongside the parent', () => {
    const ids = collectDepartmentAndDescendantIds('eng', [
      { id: 'eng', parentId: null },
      { id: 'qa', parentId: 'eng' },
    ]);

    expect(ids).toEqual(['eng', 'qa']);
  });

  it('recurses through multiple levels of descendants', () => {
    const ids = collectDepartmentAndDescendantIds('eng', [
      { id: 'eng', parentId: null },
      { id: 'qa', parentId: 'eng' },
      { id: 'automation', parentId: 'qa' },
      { id: 'rd', parentId: 'eng' },
    ]);

    expect(ids.sort()).toEqual(['automation', 'eng', 'qa', 'rd'].sort());
  });

  it('excludes unrelated departments and ancestors', () => {
    const ids = collectDepartmentAndDescendantIds('qa', [
      { id: 'eng', parentId: null },
      { id: 'qa', parentId: 'eng' },
      { id: 'automation', parentId: 'qa' },
      { id: 'unrelated', parentId: null },
    ]);

    expect(ids.sort()).toEqual(['automation', 'qa'].sort());
  });
});
