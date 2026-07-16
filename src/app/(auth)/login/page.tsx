import LoginForm from '@/features/auth/components/LoginForm';

type Props = {
  searchParams: Promise<{
    email?: string;
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { email, redirect } = await searchParams;

  return <LoginForm email={email} redirectTo={redirect} />;
}
