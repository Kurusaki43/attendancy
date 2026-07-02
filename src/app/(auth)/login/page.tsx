import LoginForm from '@/features/auth/components/LoginForm';

type Props = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { email } = await searchParams;

  return <LoginForm email={email} />;
}
