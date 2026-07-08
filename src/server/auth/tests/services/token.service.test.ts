import { describe, expect, it } from 'vitest';

import { tokenService } from '@/server/auth/services/token.service';

const payload = { userId: 'user-1', sessionId: 'session-1' };

describe('tokenService access tokens', () => {
  it('generates a token that verifies back to the original payload', async () => {
    const token = await tokenService.generateAccessToken(payload);
    const verified = await tokenService.verifyAccessToken(token);

    expect(verified).toMatchObject(payload);
  });

  it('rejects a malformed token', async () => {
    await expect(tokenService.verifyAccessToken('not-a-jwt')).resolves.toBeNull();
  });

  it('rejects an access token when verified as a refresh token (different secret)', async () => {
    const token = await tokenService.generateAccessToken(payload);

    await expect(tokenService.verifyRefreshToken(token)).resolves.toBeNull();
  });

  it('rejects a tampered token', async () => {
    const token = await tokenService.generateAccessToken(payload);
    const tampered = `${token.slice(0, -1)}${token.at(-1) === 'a' ? 'b' : 'a'}`;

    await expect(tokenService.verifyAccessToken(tampered)).resolves.toBeNull();
  });
});

describe('tokenService refresh tokens', () => {
  it('generates a token that verifies back to the original payload', async () => {
    const token = await tokenService.generateRefreshToken(payload);
    const verified = await tokenService.verifyRefreshToken(token);

    expect(verified).toMatchObject(payload);
  });

  it('rejects a refresh token when verified as an access token (different secret)', async () => {
    const token = await tokenService.generateRefreshToken(payload);

    await expect(tokenService.verifyAccessToken(token)).resolves.toBeNull();
  });
});

describe('tokenService hashToken / compareTokens', () => {
  it('compares a token against its own hash successfully', async () => {
    const token = await tokenService.generateRefreshToken(payload);
    const hashed = await tokenService.hashToken(token);

    await expect(tokenService.compareTokens(token, hashed)).resolves.toBe(true);
  });

  it('rejects a different token against an existing hash', async () => {
    const hashed = await tokenService.hashToken('some-refresh-token');

    await expect(tokenService.compareTokens('a-different-token', hashed)).resolves.toBe(false);
  });
});
