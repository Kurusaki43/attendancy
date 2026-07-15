export type ServiceProfileResult = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  provider: string;
  emailVerifiedAt: Date | null;
  hasPassword: boolean;
  roles: string[];
  createdAt: Date;
};

export type ServiceGetProfileResult = ServiceProfileResult;

export type ServiceUpdateProfileResult = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
};

export type ServiceChangePasswordResult = {
  success: boolean;
};
