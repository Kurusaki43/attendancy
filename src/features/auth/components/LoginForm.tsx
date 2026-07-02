'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SubmitButton } from '@/components/shared/SubmitButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginAction } from '@/features/auth/actions/login.action';
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';
import { type LoginInput, loginSchema } from '@/features/auth/schemas/login.schema';

const LoginForm = ({ email }: { email?: string }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email ?? '',
      password: '',
    },
  });

  const onSubmit = (data: LoginInput) => {
    form.clearErrors();

    startTransition(async () => {
      const result = await loginAction(data);

      if (!result.success) {
        if (result.code === 'EMAIL_NOT_VERIFIED') {
          toast.info(result.message);

          router.push('/verify-email');

          return;
        }

        if (result.message) {
          form.setError('root', {
            type: 'server',
            message: result.message,
          });

          toast.error(result.message);
        }

        Object.entries(result.errors ?? {}).forEach(([field, messages]) => {
          if (!messages?.length) return;

          form.setError(field as keyof LoginInput, {
            type: 'server',
            message: messages[0],
          });
        });

        return;
      }

      form.reset();

      toast.success(result.message);

      router.replace('/dashboard');
    });
  };

  return (
    <Card className="border-border/50 bg-background/40 w-full max-w-md shadow-2xl backdrop-blur-2xl">
      <CardHeader className="space-y-3 pb-8 text-center">
        <CardTitle className="text-foreground text-3xl font-bold tracking-tight">
          Welcome back
        </CardTitle>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Sign in to continue managing your attendance system.
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="bg-background/50 border-border focus-visible:border-violet-500"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-xs tracking-wide" />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-violet-500 transition-colors hover:text-violet-400"
              >
                Forgot password?
              </Link>
            </div>

            <SubmitButton
              pending={isPending}
              loadingText="Signing in..."
              className="h-11 w-full bg-violet-600 text-sm font-semibold hover:bg-violet-500"
              icon={LogIn}
            >
              Sign in
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
          Don&apos;t have an account?
          <Link
            href="/register"
            className="ml-1 rounded-md px-2 py-1 font-medium text-violet-500 transition-all hover:bg-violet-500/10 hover:text-violet-400"
          >
            Create one →
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
