import { AppError } from './app.error';
import type { ErrorCode } from './error-codes';

export class TooManyRequestsError extends AppError {
  readonly statusCode = 429;

  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}
