import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { positionRepository } from '@/server/positions/repositories/position.repository';
import type { DeletePositionServiceResult } from '@/server/positions/types';

export async function deletePosition(positionId: string): Promise<DeletePositionServiceResult> {
  const position = await positionRepository.findById(positionId);

  if (!position) {
    throw new NotFoundError(ERROR_CODES.POSITION_NOT_FOUND, 'Position not found!');
  }

  await positionRepository.delete(positionId);
}
