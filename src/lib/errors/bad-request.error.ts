import { AppError } from './app.error';
import type { ErrorCode } from './error-codes';

export class BadRequestError extends AppError {
  readonly statusCode = 400;

  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}
