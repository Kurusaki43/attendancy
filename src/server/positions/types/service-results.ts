import type { Position } from '@/generated/prisma/client';

export type CreatePositionServiceResult = Position;

export type UpdatePositionServiceResult = Position;

export type GetPositionServiceResult = Position;

export type DeletePositionServiceResult = void;

export type GetPositionStatsServiceResult = {
  totalPositions: number;
  activePositions: number;
  inactivePositions: number;
};
