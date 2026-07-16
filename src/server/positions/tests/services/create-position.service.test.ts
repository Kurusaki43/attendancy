import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/position.repository', () => ({
  positionRepository: {
    findByTitle: vi.fn(),
    findByCode: vi.fn(),
    create: vi.fn(),
  },
}));

const { positionRepository } = await import('../../repositories/position.repository');
const { ConflictError } = await import('@/lib/errors/conflict.error');
const { createPosition } = await import('../../services/create-position.service');

const input = { title: 'Software Engineer', code: 'SWE', isActive: true };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createPosition', () => {
  it('creates the position when the title and code are both unused', async () => {
    vi.mocked(positionRepository.findByTitle).mockResolvedValue(null);
    vi.mocked(positionRepository.findByCode).mockResolvedValue(null);
    vi.mocked(positionRepository.create).mockResolvedValue({ id: 'position-1', ...input } as never);

    const result = await createPosition(input);

    expect(positionRepository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual({ id: 'position-1', ...input });
  });

  it('throws ConflictError when the title is already taken', async () => {
    vi.mocked(positionRepository.findByTitle).mockResolvedValue({ id: 'existing' } as never);

    const result = createPosition(input);

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_ALREADY_EXISTS });
    expect(positionRepository.create).not.toHaveBeenCalled();
  });

  it('throws ConflictError when the code is already taken', async () => {
    vi.mocked(positionRepository.findByTitle).mockResolvedValue(null);
    vi.mocked(positionRepository.findByCode).mockResolvedValue({ id: 'existing' } as never);

    const result = createPosition(input);

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_CODE_ALREADY_EXISTS });
    expect(positionRepository.create).not.toHaveBeenCalled();
  });
});
