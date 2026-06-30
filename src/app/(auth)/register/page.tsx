import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import RegisterForm from '@/features/auth/components/RegisterForm';

export default async function RegisterPage() {
  const cookieStore = await cookies();

  const pendingVerification = cookieStore.get('pending_email_verification');

  if (pendingVerification) {
    redirect('/verify-email');
  }

  return <RegisterForm />;
}
