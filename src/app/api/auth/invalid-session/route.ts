import { NextResponse } from 'next/server';

import { AUTH_COOKIES } from '@/features/auth/constants/auth.constant';

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url));

  response.cookies.delete(AUTH_COOKIES.ACCESS_TOKEN);
  response.cookies.delete(AUTH_COOKIES.REFRESH_TOKEN);

  return response;
}
