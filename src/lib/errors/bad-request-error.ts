import { AppError } from './ app.error';

export class BadRequestError extends AppError {
  readonly statusCode = 400;

  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
