import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import VerifyEmail from '@/features/auth/components/VerifyEmail';
import { userRepository } from '@/features/auth/repositories/user.repository';

const VerifyEmailPage = async () => {
  const cookieStore = await cookies();

  const userId = cookieStore.get('pending_email_verification')?.value;

  if (!userId) {
    redirect('/register');
  }

  const user = await userRepository.findByIdSafeFields(userId);

  if (!user) {
    redirect('/register');
  }

  return <VerifyEmail userId={user.id} email={user.email} />;
};

export default VerifyEmailPage;
