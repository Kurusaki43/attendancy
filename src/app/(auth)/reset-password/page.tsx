import { redirect } from 'next/navigation';

import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';
import { getPendingPasswordResetCookie } from '@/server/auth/lib/cookies';

type ResetPasswordPageProps = Readonly<{
  searchParams: Promise<{
    token: string;
    id: string;
  }>;
}>;

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const hasPendingReset = await getPendingPasswordResetCookie();

  if (!hasPendingReset) {
    redirect('/forgot-password');
  }

  const { token, id } = await searchParams;

  return <ResetPasswordForm token={token} id={id} />;
};

export default ResetPasswordPage;
