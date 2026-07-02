'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { SubmitButton } from '@/components/shared/SubmitButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { registerAction } from '@/features/auth/actions/register.action';
import {
  type RegisterFormInput,
  registerFormSchema,
} from '@/features/auth/schemas/register.schema';

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

  const captchaToken = useWatch({
    control: form.control,
    name: 'captchaToken',
  });

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
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground! text-sm font-medium">
                      First Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="John"
                        autoComplete="given-name"
                        className="bg-background/50 border-border focus-visible:border-violet-500"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-xs tracking-wide" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground! text-sm font-medium">
                      Last Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Doe"
                        autoComplete="family-name"
                        className="bg-background/50 border-border focus-visible:border-violet-500"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-xs tracking-wide" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground! text-sm font-medium">Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      autoComplete="email"
                      className="bg-background/50 border-border focus-visible:border-violet-500"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-xs tracking-wide" />
                </FormItem>
              )}
            />
            <div className="grid items-start gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground! text-sm font-medium">Password</FormLabel>

                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="bg-background/50 border-border focus-visible:border-violet-500"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription className="text-xs">
                      Must contain at least 8 characters.
                    </FormDescription>

                    <FormMessage className="text-xs tracking-wide" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground! text-sm font-medium">
                      Confirm Password
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="bg-background/50 border-border focus-visible:border-violet-500"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-xs tracking-wide" />
                  </FormItem>
                )}
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
              disabled={!captchaToken || isPending}
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
