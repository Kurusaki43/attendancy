'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import RHFInput from '@/components/shared/RHFInput';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { registerAction } from '@/server/auth/actions/register.action';
import { type RegisterFormInput, registerFormSchema } from '@/server/auth/schemas/register.schema';

import { GoogleLoginButton } from './GoogleLoginButton';
import { TurnstileField } from './TurnstileCaptcha';

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      captchaToken: '',
    },
  });

  const watchedFields = useWatch({
    control: form.control,
  });

  const isFormFilled =
    !!watchedFields.firstName?.trim() &&
    !!watchedFields.lastName?.trim() &&
    !!watchedFields.email?.trim() &&
    !!watchedFields.password?.trim() &&
    !!watchedFields.confirmPassword?.trim() &&
    !!watchedFields.captchaToken;

  const onSubmit = (data: RegisterFormInput) => {
    form.clearErrors();

    startTransition(async () => {
      const result = await registerAction(data);

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

          form.setError(field as keyof RegisterFormInput, {
            type: 'server',
            message: messages[0],
          });
        });

        return;
      }

      form.reset();

      toast.success(result.message);

      router.push('/verify-email');
    });
  };

  return (
    <Card className="border-border/50 bg-background/40 w-full max-w-md shadow-2xl backdrop-blur-2xl">
      <CardHeader className="space-y-3 pb-2 text-center">
        <CardTitle className="text-foreground text-3xl font-bold tracking-tight">
          Create your account
        </CardTitle>

        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          Get started by creating your account and managing attendance effortlessly.
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
            <div className="grid items-start gap-4 sm:grid-cols-2">
              <RHFInput
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="John"
                autoComplete="given-name"
                icon={UserRound}
                className="bg-background/50 border-border focus-visible:border-violet-500"
              />

              <RHFInput
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Doe"
                autoComplete="family-name"
                icon={UserRound}
                className="bg-background/50 border-border focus-visible:border-violet-500"
              />
            </div>

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

            <div className="grid items-start gap-4 sm:grid-cols-2">
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
            </div>

            <TurnstileField
              onVerify={(token) => {
                form.setValue('captchaToken', token, {
                  shouldValidate: true,
                });
              }}
            />

            <SubmitButton
              className="h-11 w-full bg-violet-600 text-sm font-semibold hover:bg-violet-500"
              loadingText="Creating account..."
              pending={form.formState.isSubmitting}
              disabled={!isFormFilled || isPending}
            >
              Create account
            </SubmitButton>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="bg-border h-px flex-1" />

              <span className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
                Or continue with
              </span>

              <div className="bg-border h-px flex-1" />
            </div>

            <GoogleLoginButton />
          </form>
        </Form>
      </CardContent>

      <CardFooter className="border-border/50 mb-2 flex justify-center border-t pt-4 pb-3">
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?
          <Link
            href="/login"
            className="ml-1 rounded-md px-2 py-1 font-medium text-violet-500 transition-all hover:bg-violet-500/10 hover:text-violet-400"
          >
            Sign in →
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
