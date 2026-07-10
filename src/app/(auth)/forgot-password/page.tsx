'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, SendHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import RHFInput from '@/components/shared/RHFInput';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { forgotPasswordAction } from '@/server/auth/actions/forgot-password.action';
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from '@/server/auth/schemas/forgot-password.schema';

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    form.clearErrors();

    startTransition(async () => {
      const result = await forgotPasswordAction(data);

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

          form.setError(field as keyof ForgotPasswordInput, {
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
          Forgot Password?
        </CardTitle>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <RHFInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
              icon={Mail}
              className="bg-background/50 border-border focus-visible:border-violet-500"
            />

            <SubmitButton
              pending={isPending}
              loadingText="Sending reset link..."
              className="h-11 w-full bg-violet-600 text-sm font-semibold hover:bg-violet-500"
              icon={SendHorizontal}
            >
              Send Reset Link
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
            href="/register"
            className="font-medium text-violet-500 transition-colors hover:text-violet-400"
          >
            Create an account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordPage;
