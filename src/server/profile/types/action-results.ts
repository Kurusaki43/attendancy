export type ProfileResult = {
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
  locale: string;
  timezone: string;
};

export type GetProfileActionResult = ProfileResult;

export type UpdateProfileActionResult = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
};

export type ChangePasswordActionResult = null;
