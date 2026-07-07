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
