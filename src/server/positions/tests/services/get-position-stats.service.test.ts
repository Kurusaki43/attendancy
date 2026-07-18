import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/position.repository', () => ({
  positionRepository: {
    count: vi.fn(),
  },
}));

const { positionRepository } = await import('../../repositories/position.repository');
const { getPositionStats } = await import('../../services/get-position-stats.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getPositionStats', () => {
  it('returns total, active, and inactive position counts', async () => {
    vi.mocked(positionRepository.count).mockResolvedValueOnce(10);
    vi.mocked(positionRepository.count).mockResolvedValueOnce(7);
    vi.mocked(positionRepository.count).mockResolvedValueOnce(3);

    const result = await getPositionStats();

    expect(positionRepository.count).toHaveBeenNthCalledWith(1);
    expect(positionRepository.count).toHaveBeenNthCalledWith(2, { isActive: true });
    expect(positionRepository.count).toHaveBeenNthCalledWith(3, { isActive: false });
    expect(result).toEqual({ totalPositions: 10, activePositions: 7, inactivePositions: 3 });
  });
});
