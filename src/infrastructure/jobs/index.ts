export interface JobMap {
  email: {
    'send-welcome': {
      to: string;
      name: string;
    };
    'send-reset-password': {
      to: string;
      token: string;
    };
  };
}
