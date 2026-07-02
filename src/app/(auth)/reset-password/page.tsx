import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';

type ResetPasswordPageProps = Readonly<{
  searchParams: {
    token: string;
    id: string;
  };
}>;

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const { token, id } = await searchParams;

  return <ResetPasswordForm token={token} id={id} />;
};

export default ResetPasswordPage;
