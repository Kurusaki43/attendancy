export type ActionResult<TData = void> =
  | {
      success: true;
      data: TData;
      message?: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Record<string, string[]>;
    };
