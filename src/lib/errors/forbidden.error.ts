import { AppError } from './ app.error';
import type { ErrorCode } from './error-codes';

export class ForbiddenError extends AppError {
  readonly statusCode = 403;

  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}
