import { redirect } from 'next/navigation';

import VerifyEmail from '@/features/auth/components/VerifyEmail';
import { getPendingEmailVerificationCookie } from '@/server/auth/lib/cookies';
import { getPendingVerificationUser } from '@/server/auth/services/email-verification.service';

const VerifyEmailPage = async () => {
  const userId = await getPendingEmailVerificationCookie();

  if (!userId) {
    redirect('/register');
  }

  const user = await getPendingVerificationUser(userId);

  if (!user) {
    redirect('/api/auth/clear-pending-verification');
  }

  if (user.emailVerifiedAt) {
    redirect('/login');
  }

  return <VerifyEmail userId={user.id} email={user.email} />;
};

export default VerifyEmailPage;
