export type ServiceLoginResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
};

export type ServiceRegisterResult = {
  id: string;
  email: string;
  requiresEmailVerification: boolean;
};

export type ServiceCreateSessionResult = {
  accessToken: string;
  refreshToken: string;
};

export type ServiceRefreshSessionResult = {
  accessToken: string;
  refreshToken: string;
};

export type ServiceEmailVerificationResult = {
  success: boolean;
};

export type ServiceResetPasswordResult = {
  success: boolean;
};

export type ServiceGoogleAuthResult = {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  avatar: string | null;
  provider: string;
  providerId: string | null;
  emailVerifiedAt: Date | null;
  status: string;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
};
