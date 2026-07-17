/**
 * Auth feature types
 * Centralized export for all auth-related types
 */

// Action layer types (client-facing)
export type {
  ListSessionsActionResult,
  LoginResult,
  RegisterResult,
  SessionResult,
  VerifyEmailResult,
} from './action-results';

// Domain types
export type { AuthUser } from './auth-user';

// Service layer types (internal)
export type {
  ServiceAcceptInviteResult,
  ServiceCreateSessionResult,
  ServiceEmailVerificationResult,
  ServiceGoogleAuthResult,
  ServiceListSessionsResult,
  ServiceLoginResult,
  ServiceRefreshSessionResult,
  ServiceRegisterResult,
  ServiceResetPasswordResult,
  ServiceSessionResult,
} from './service-results';
