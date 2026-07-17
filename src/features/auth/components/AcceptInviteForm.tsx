'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import RHFInput from '@/components/shared/RHFInput';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { acceptInviteAction } from '@/server/auth/actions/accept-invite.action';
import type { AcceptInviteFormInput } from '@/server/auth/schemas/accept-invite.schema';
import {
  acceptInviteFormSchema,
  type AcceptInviteInput,
} from '@/server/auth/schemas/accept-invite.schema';

type AcceptInviteFormProps = {
  token: string;
  id: string;
};

const AcceptInviteForm = ({ token, id }: AcceptInviteFormProps) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<AcceptInviteFormInput>({
    resolver: zodResolver(acceptInviteFormSchema),
    defaultValues: {
      id: id ?? '',
      token: token ?? '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: AcceptInviteInput) => {
    form.clearErrors();

    startTransition(async () => {
      const result = await acceptInviteAction({
        ...data,
        token,
      });

      if (!result.success) {
        if (result.message) {
          form.setError('root', {
            type: 'server',
            message: result.message,
          });

          toast.error(result.message);
        }

        Object.entries(result.errors ?? {}).forEach(([field, messages]) => {
          if (!messages?.length) return;

          form.setError(field as keyof AcceptInviteInput, {
            type: 'server',
            message: messages[0],
          });
        });

        return;
      }

      form.reset();

      toast.success(result.message);

      router.replace('/login');
    });
  };

  return (
    <Card className="border-border/50 bg-background/40 w-full max-w-md shadow-2xl backdrop-blur-2xl">
      <CardHeader className="space-y-3 pb-2 text-center">
        <CardTitle className="text-foreground text-3xl font-bold tracking-tight">
          Activate Your Account
        </CardTitle>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Set a password to finish setting up your account.
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <RHFInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              icon={Lock}
              className="bg-background/50 border-border focus-visible:border-violet-500"
            />

            <RHFInput
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              icon={Lock}
              className="bg-background/50 border-border focus-visible:border-violet-500"
            />

            <SubmitButton
              pending={isPending}
              loadingText="Activating account..."
              className="h-11 w-full bg-violet-600 text-sm font-semibold hover:bg-violet-500"
              icon={KeyRound}
            >
              Activate Account
            </SubmitButton>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="border-border/50 justify-center border-t pt-5">
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <Link
            href="/login"
            className="font-medium text-violet-500 transition-colors hover:text-violet-400"
          >
            Back to sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AcceptInviteForm;
