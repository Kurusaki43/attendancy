/**
 * Auth feature types
 * Centralized export for all auth-related types
 */

// Action layer types (client-facing)
export type { LoginResult, RegisterResult, VerifyEmailResult } from './action-results';

// Domain types
export type { AuthUser } from './auth-user';

// Service layer types (internal)
export type {
  ServiceCreateSessionResult,
  ServiceEmailVerificationResult,
  ServiceGoogleAuthResult,
  ServiceLoginResult,
  ServiceRefreshSessionResult,
  ServiceRegisterResult,
  ServiceResetPasswordResult,
} from './service-results';
