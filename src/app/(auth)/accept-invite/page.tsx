import AcceptInviteForm from '@/features/auth/components/AcceptInviteForm';

type AcceptInvitePageProps = Readonly<{
  searchParams: Promise<{
    token: string;
    id: string;
  }>;
}>;

const AcceptInvitePage = async ({ searchParams }: AcceptInvitePageProps) => {
  const { token, id } = await searchParams;

  return <AcceptInviteForm token={token} id={id} />;
};

export default AcceptInvitePage;
