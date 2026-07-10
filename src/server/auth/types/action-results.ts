import type { DeviceType } from '@/server/auth/lib/parse-user-agent';

export type RegisterResult = {
  email: string;
  userId: string;
};

export type VerifyEmailResult = {
  emailVerified: true;
};

export type LoginResult = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
};

export type SessionResult = {
  id: string;
  browser: string;
  os: string;
  deviceType: DeviceType;
  ipAddress: string | null;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
};

export type ListSessionsActionResult = SessionResult[];
