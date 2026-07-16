import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/position.repository', () => ({
  positionRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
}));

const { positionRepository } = await import('../../repositories/position.repository');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { getAllPositions } = await import('../../services/get-all-positions.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getAllPositions', () => {
  it('returns positions and pagination metadata for a default query', async () => {
    const positions = [{ id: 'position-1', title: 'Software Engineer' }];
    vi.mocked(positionRepository.findMany).mockResolvedValue(positions as never);
    vi.mocked(positionRepository.count).mockResolvedValue(1);

    const result = await getAllPositions({});

    expect(positionRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'desc' }],
        skip: 0,
        take: 10,
      }),
    );
    expect(result).toEqual({
      positions,
      pagination: expect.objectContaining({ page: 1, limit: 10, totalItems: 1 }),
    });
  });

  it('applies the isActive filter when provided', async () => {
    vi.mocked(positionRepository.findMany).mockResolvedValue([] as never);
    vi.mocked(positionRepository.count).mockResolvedValue(0);

    await getAllPositions({ isActive: 'true' });

    expect(positionRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isActive: true }) }),
    );
  });

  it('throws BadRequestError for an invalid sort value', async () => {
    const result = getAllPositions({ sort: 'not-a-real-field' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    expect(positionRepository.findMany).not.toHaveBeenCalled();
  });
});
