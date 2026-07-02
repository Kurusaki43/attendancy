import { redirect } from 'next/navigation';

import VerifyEmail from '@/features/auth/components/VerifyEmail';
import { getPendingEmailVerificationCookie } from '@/features/auth/lib/cookies';
import { userRepository } from '@/features/auth/repositories/user.repository';

const VerifyEmailPage = async () => {
  const userId = await getPendingEmailVerificationCookie();

  if (!userId) {
    redirect('/register');
  }

  const user = await userRepository.findByIdSafeFields(userId);

  if (!user) {
    redirect('/api/auth/clear-pending-verification');
  }

  if (user.emailVerifiedAt) {
    redirect('/login');
  }

  return <VerifyEmail userId={user.id} email={user.email} />;
};

export default VerifyEmailPage;
