import { OAuth2RequestError } from 'arctic';

import { google } from '../lib/google';
import { userRepository } from '../repositories/user.repository';

type GoogleUser = {
  sub: string;
  email: string;
  email_verified: boolean;
  given_name: string;
  family_name: string;
  picture?: string;
};

export async function authenticateWithGoogle(code: string, codeVerifier: string) {
  let tokens;

  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      throw new Error('Invalid Google authorization code');
    }

    throw error;
  }

  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Google profile');
  }

  const profile: GoogleUser = await response.json();

  if (!profile.email_verified) {
    throw new Error('Google email is not verified');
  }

  let user = await userRepository.findByEmail(profile.email);

  if (!user) {
    user = await userRepository.create({
      email: profile.email,
      firstName: profile.given_name,
      lastName: profile.family_name,
      avatar: profile.picture,
      provider: 'GOOGLE',
      providerId: profile.sub,
      emailVerifiedAt: new Date(),
    });

    return user;
  }

  if (user.provider === 'LOCAL') {
    user = await userRepository.update({
      userId: user.id,
      newData: {
        provider: 'GOOGLE',
        providerId: profile.sub,
        avatar: profile.picture,
        emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt : new Date(),
      },
    });
  }

  return user;
}
