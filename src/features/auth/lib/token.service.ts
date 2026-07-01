import { hash, verify } from '@node-rs/argon2';
import { jwtVerify, SignJWT } from 'jose';

import { env } from '@/lib/env/env';

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);

const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

type TokenPayload = {
  userId: string;
  sessionId: string;
};

export const tokenService = {
  async generateAccessToken(payload: TokenPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(env.JWT_ACCESS_EXPIRES_IN)
      .sign(accessSecret);
  },

  async generateRefreshToken(payload: TokenPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(env.JWT_REFRESH_EXPIRES_IN)
      .sign(refreshSecret);
  },

  async verifyAccessToken(token: string) {
    const { payload } = await jwtVerify<TokenPayload>(token, accessSecret, {
      algorithms: ['HS256'],
    });

    return payload;
  },

  async verifyRefreshToken(token: string) {
    const { payload } = await jwtVerify<TokenPayload>(token, refreshSecret, {
      algorithms: ['HS256'],
    });

    return payload;
  },

  async hashToken(token: string) {
    return hash(token);
  },

  async compareTokens(token: string, hashedToken: string) {
    return verify(hashedToken, token);
  },
};
