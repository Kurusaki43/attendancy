import type { PaginationMeta } from '@/shared/types/api-feature';

export type PositionResult = {
  id: string;
  title: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePositionActionResult = PositionResult;

export type UpdatePositionActionResult = PositionResult;

export type GetPositionActionResult = PositionResult;

export type GetAllPositionsActionResult = {
  positions: PositionResult[];
  pagination: PaginationMeta;
};

export type DeletePositionActionResult = void;

export type GetPositionStatsActionResult = {
  totalPositions: number;
  activePositions: number;
  inactivePositions: number;
};
