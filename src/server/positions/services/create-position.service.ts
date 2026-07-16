import type { PositionCreateInput } from '@/generated/prisma/models';
import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { positionRepository } from '@/server/positions/repositories/position.repository';
import type { CreatePositionServiceResult } from '@/server/positions/types';

export async function createPosition(
  positionInput: Omit<PositionCreateInput, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<CreatePositionServiceResult> {
  const position = await positionRepository.findByTitle(positionInput.title);

  if (position) {
    throw new ConflictError(ERROR_CODES.POSITION_ALREADY_EXISTS, 'Position already exist!');
  }

  const positionWithCode = await positionRepository.findByCode(positionInput.code);

  if (positionWithCode) {
    throw new ConflictError(
      ERROR_CODES.POSITION_CODE_ALREADY_EXISTS,
      'Position code already in use!',
    );
  }

  return await positionRepository.create(positionInput);
}
