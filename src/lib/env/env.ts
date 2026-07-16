import type { StringValue } from 'ms';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  APP_URL: z.url().default('http://localhost:3000'),
  DATABASE_URL: z.url(),

  // ioredis parses the scheme itself — rediss:// (as Upstash/most managed providers issue)
  // enables TLS automatically, redis:// doesn't.
  REDIS_URL: z.url().default('redis://localhost:6379'),

  SMTP_HOST: z.string().min(1).default('localhost'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.email().default('noreply@attendance-app.local'),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.custom<StringValue>(),
  JWT_REFRESH_EXPIRES_IN: z.custom<StringValue>(),
  OTP_EXPIRED_IN: z.custom<StringValue>(),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.url(),

  TURNSTILE_SECRET_KEY: z.string(),

  // How many reverse-proxy hops in front of this app are trusted to have set (not merely
  // forwarded) x-forwarded-for — 0 means none, so the header is never trusted and client IP
  // resolves to 'unknown'. Only raise this once the actual deployment's proxy layer is confirmed
  // to strip any client-supplied value before appending its own (see getClientIp).
  TRUSTED_PROXY_HOPS: z.coerce.number().int().min(0).default(0),
});

export const env = envSchema.parse(process.env);
