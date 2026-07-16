import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/position.repository', () => ({
  positionRepository: {
    findById: vi.fn(),
  },
}));

const { positionRepository } = await import('../../repositories/position.repository');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { getPosition } = await import('../../services/get-position.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getPosition', () => {
  it('returns the position when it exists', async () => {
    const position = { id: 'position-1', title: 'Software Engineer' };
    vi.mocked(positionRepository.findById).mockResolvedValue(position as never);

    const result = await getPosition('position-1');

    expect(positionRepository.findById).toHaveBeenCalledWith('position-1');
    expect(result).toEqual(position);
  });

  it('throws NotFoundError when the position does not exist', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue(null);

    const result = getPosition('missing-id');

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_NOT_FOUND });
  });
});
