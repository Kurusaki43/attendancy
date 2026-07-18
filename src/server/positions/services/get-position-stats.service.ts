import { positionRepository } from '@/server/positions/repositories/position.repository';
import type { GetPositionStatsServiceResult } from '@/server/positions/types';

export async function getPositionStats(): Promise<GetPositionStatsServiceResult> {
  const [totalPositions, activePositions, inactivePositions] = await Promise.all([
    positionRepository.count(),
    positionRepository.count({ isActive: true }),
    positionRepository.count({ isActive: false }),
  ]);

  return { totalPositions, activePositions, inactivePositions };
}
