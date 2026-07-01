import { NextResponse } from 'next/server';

import { AUTH_COOKIES } from '@/features/auth/constants/auth.constant';

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/register', request.url));

  response.cookies.delete(AUTH_COOKIES.PENDING_EMAIL_VERIFICATION);

  return response;
}
