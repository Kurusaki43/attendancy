import { OAuth2RequestError } from 'arctic';

import { getGoogleProfile } from '../lib/get-google-profile';
import { google } from '../lib/google';
import { userRepository } from '../repositories/user.repository';

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

  const profile = await getGoogleProfile(tokens.accessToken());

  if (!profile.email_verified) {
    throw new Error('Google email is not verified');
  }

  const user = await userRepository.findByEmail(profile.email);

  if (!user) {
    return userRepository.create({
      email: profile.email,
      firstName: profile.given_name,
      lastName: profile.family_name,
      avatar: profile.picture,
      provider: 'GOOGLE',
      providerId: profile.sub,
      emailVerifiedAt: new Date(),
      status: 'ACTIVE',
    });
  }

  if (user.provider === 'LOCAL') {
    throw new Error(
      'An account with this email already exists. Please sign in with your password.',
    );
  }

  if (user.providerId !== profile.sub) {
    throw new Error('Invalid Google account');
  }

  return user;
}
