'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import RHFInput from '@/components/shared/RHF/RHFInput';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { resetPasswordAction } from '@/features/auth/actions/reset-password.action';
import type { ResetPasswordFormInput } from '@/features/auth/schemas/reset-password.schema';
import {
  resetPasswordFormSchema,
  type ResetPasswordInput,
} from '@/features/auth/schemas/reset-password.schema';

type ResetPasswordPageProps = {
  token: string;
  id: string;
};

const ResetPasswordForm = ({ token, id }: ResetPasswordPageProps) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      id: id ?? '',
      token: token ?? '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    form.clearErrors();

    startTransition(async () => {
      const result = await resetPasswordAction({
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

          setTimeout(() => {
            router.replace('/forgot-password');
          }, 2000);
        }

        Object.entries(result.errors ?? {}).forEach(([field, messages]) => {
          if (!messages?.length) return;

          form.setError(field as keyof ResetPasswordInput, {
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
          Reset Password
        </CardTitle>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Choose a new password for your account. Make sure it&apos;s strong and secure.
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <RHFInput
              control={form.control}
              name="newPassword"
              label="New Password"
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
              loadingText="Updating password..."
              className="h-11 w-full bg-violet-600 text-sm font-semibold hover:bg-violet-500"
              icon={KeyRound}
            >
              Reset Password
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

          <span className="text-border">•</span>

          <Link
            href="/forgot-password"
            className="font-medium text-violet-500 transition-colors hover:text-violet-400"
          >
            Request a new link
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
