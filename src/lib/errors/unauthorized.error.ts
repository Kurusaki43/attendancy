import { AppError } from './ app.error';
import type { ErrorCode } from './error-codes';

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;

  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}
