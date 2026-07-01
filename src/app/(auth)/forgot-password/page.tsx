'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizontal } from 'lucide-react';
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
import { forgotPasswordAction } from '@/features/auth/actions/forgot-password.action';
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from '@/features/auth/schemas/forgot-password.schema';

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
        // Handle server-side validation errors
        if (result.message) {
          form.setError('root', {
            type: 'server',
            message: result.message,
          });

          toast.error(result.message);
        }

        // Handle field-specific errors
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

      <CardFooter className="border-border/50 mb-2 flex justify-center border-t pt-4 pb-3">
        <p className="text-muted-foreground text-center text-sm">
          Did not receive the code?
          {/* <ResendButton email={form.getValues('email')} /> */}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordPage;
