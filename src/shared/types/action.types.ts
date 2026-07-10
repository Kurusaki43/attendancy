export type ActionResult<TData = void> =
  | {
      success: true;
      data: TData;
      message?: string;
    }
  | {
      success: false;
      message?: string;
      code?: string;
      errors?: Record<string, string[]>;
    };
