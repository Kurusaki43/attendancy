import { AppError } from './ app.error';
import type { ErrorCode } from './error-codes';

export class ConflictError extends AppError {
  readonly statusCode = 409;

  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}
