import type { PositionUpdateInput } from '@/generated/prisma/models';
import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { positionRepository } from '@/server/positions/repositories/position.repository';
import type { UpdatePositionServiceResult } from '@/server/positions/types';

export async function updatePosition(
  positionId: string,
  positionInput: PositionUpdateInput,
): Promise<UpdatePositionServiceResult> {
  const position = await positionRepository.findById(positionId);

  if (!position) {
    throw new NotFoundError(ERROR_CODES.POSITION_NOT_FOUND, 'Position not found!');
  }

  if (typeof positionInput.code === 'string') {
    const positionWithCode = await positionRepository.findByCode(positionInput.code);

    if (positionWithCode && positionWithCode.id !== positionId) {
      throw new ConflictError(
        ERROR_CODES.POSITION_CODE_ALREADY_EXISTS,
        'Position code already in use!',
      );
    }
  }

  return await positionRepository.update(positionId, positionInput);
}
