import { AppError } from './app.error';
import type { ErrorCode } from './error-codes';

export class NotFoundError extends AppError {
  readonly statusCode = 404;

  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}
