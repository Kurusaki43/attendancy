import { AppError } from './app.error';
import type { ErrorCode } from './error-codes';

export class InternalServerError extends AppError {
  readonly statusCode = 500;

  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}
