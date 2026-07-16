import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/position.repository', () => ({
  positionRepository: {
    findById: vi.fn(),
    delete: vi.fn(),
  },
}));

const { positionRepository } = await import('../../repositories/position.repository');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { deletePosition } = await import('../../services/delete-position.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('deletePosition', () => {
  it('deletes the position when it exists', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue({ id: 'position-1' } as never);
    vi.mocked(positionRepository.delete).mockResolvedValue(undefined as never);

    await deletePosition('position-1');

    expect(positionRepository.delete).toHaveBeenCalledWith('position-1');
  });

  it('throws NotFoundError when the position does not exist', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue(null);

    const result = deletePosition('missing-id');

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_NOT_FOUND });
    expect(positionRepository.delete).not.toHaveBeenCalled();
  });
});
