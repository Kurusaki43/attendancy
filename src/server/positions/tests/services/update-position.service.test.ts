import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/position.repository', () => ({
  positionRepository: {
    findById: vi.fn(),
    findByCode: vi.fn(),
    update: vi.fn(),
  },
}));

const { positionRepository } = await import('../../repositories/position.repository');
const { ConflictError } = await import('@/lib/errors/conflict.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { updatePosition } = await import('../../services/update-position.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('updatePosition', () => {
  it('throws NotFoundError when the position does not exist', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue(null);

    const result = updatePosition('missing-id', { title: 'New Title' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_NOT_FOUND });
  });

  it('updates the position when no code is provided', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue({ id: 'position-1' } as never);
    vi.mocked(positionRepository.update).mockResolvedValue({
      id: 'position-1',
      title: 'New Title',
    } as never);

    const result = await updatePosition('position-1', { title: 'New Title' });

    expect(positionRepository.findByCode).not.toHaveBeenCalled();
    expect(positionRepository.update).toHaveBeenCalledWith('position-1', { title: 'New Title' });
    expect(result).toEqual({ id: 'position-1', title: 'New Title' });
  });

  it('allows keeping the same code on the same position', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue({ id: 'position-1' } as never);
    vi.mocked(positionRepository.findByCode).mockResolvedValue({ id: 'position-1' } as never);
    vi.mocked(positionRepository.update).mockResolvedValue({ id: 'position-1' } as never);

    await updatePosition('position-1', { code: 'SWE' });

    expect(positionRepository.update).toHaveBeenCalledWith('position-1', { code: 'SWE' });
  });

  it('throws ConflictError when the code belongs to a different position', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue({ id: 'position-1' } as never);
    vi.mocked(positionRepository.findByCode).mockResolvedValue({ id: 'position-2' } as never);

    const result = updatePosition('position-1', { code: 'SWE' });

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_CODE_ALREADY_EXISTS });
    expect(positionRepository.update).not.toHaveBeenCalled();
  });
});
