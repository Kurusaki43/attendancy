import { OAuth2RequestError } from 'arctic';

import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { InternalServerError } from '@/lib/errors/internal-server.error';
import { UnauthorizedError } from '@/lib/errors/unauthorized.error';
import { prisma } from '@/lib/prisma';
import { ROLE_NAMES } from '@/server/auth/constants/roles';
import { getGoogleProfile } from '@/server/auth/lib/get-google-profile';
import { google } from '@/server/auth/lib/google';
import { userRepository } from '@/server/auth/repositories/user.repository';
import type { ServiceGoogleAuthResult } from '@/server/auth/types/service-results';

export async function authenticateWithGoogle(
  code: string,
  codeVerifier: string,
): Promise<ServiceGoogleAuthResult> {
  let tokens;

  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, 'Invalid Google authorization code');
    }

    throw error;
  }

  const profile = await getGoogleProfile(tokens.accessToken());

  if (!profile.email_verified) {
    throw new BadRequestError(
      ERROR_CODES.GOOGLE_EMAIL_NOT_VERIFIED,
      'Google email is not verified',
    );
  }

  const user = await userRepository.findByEmail(profile.email);

  if (!user) {
    // Get the EMPLOYEE role (default role for new users)
    const employeeRole = await prisma.role.findUnique({
      where: { name: ROLE_NAMES.EMPLOYEE },
    });

    if (!employeeRole) {
      throw new InternalServerError(
        ERROR_CODES.ROLE_NOT_FOUND,
        'EMPLOYEE role not found. Please run database seeds.',
      );
    }

    return userRepository.create({
      email: profile.email,
      firstName: profile.given_name,
      lastName: profile.family_name,
      avatar: profile.picture,
      provider: 'GOOGLE',
      providerId: profile.sub,
      emailVerifiedAt: new Date(),
      status: 'ACTIVE',
      roles: {
        connect: {
          id: employeeRole.id,
        },
      },
    });
  }

  if (user.provider === 'LOCAL') {
    throw new ConflictError(
      ERROR_CODES.EMAIL_EXISTS_WITH_PASSWORD,
      'An account with this email already exists. Please sign in with your password.',
    );
  }

  if (user.providerId !== profile.sub) {
    throw new UnauthorizedError(ERROR_CODES.UNAUTHORIZED, 'Invalid Google account');
  }

  return user;
}
