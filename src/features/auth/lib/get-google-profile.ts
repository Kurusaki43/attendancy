import { BadRequestError } from '@/lib/errors/bad-request-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

export type GoogleUser = {
  sub: string;
  email: string;
  email_verified: boolean;
  given_name: string;
  family_name: string;
  picture?: string;
};

export async function getGoogleProfile(accessToken: string): Promise<GoogleUser> {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new BadRequestError(
      ERROR_CODES.GOOGLE_PROFILE_FETCH_FAILED,
      'Failed to fetch Google profile',
    );
  }

  return response.json();
}
