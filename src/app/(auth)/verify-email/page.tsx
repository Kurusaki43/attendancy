'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BadgeCheck, MailCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
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
import { verifyEmailAction } from '@/features/auth/actions/email-verify.action';
import { ResendButton } from '@/features/auth/components/ResendButtond';
import {
  type VerifyEmailInput,
  verifyEmailSchema,
} from '@/features/auth/schemas/email-verification.schema';

const VerifyEmail = () => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') ?? '';
  const userId = searchParams.get('userId') ?? '';

  const form = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      userId,
      code: '',
    },
  });

  const onSubmit = (data: VerifyEmailInput) => {
    form.clearErrors();

    startTransition(async () => {
      const result = await verifyEmailAction(data);

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

          form.setError(field as keyof VerifyEmailInput, {
            type: 'server',
            message: messages[0],
          });
        });

        return;
      }

      toast.success(result.message);

      router.replace(`/login?email=${email}`);
    });
  };

  return (
    <Card className="border-border/50 bg-background/40 w-full max-w-md shadow-2xl backdrop-blur-2xl">
      <CardHeader className="space-y-4 pb-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-violet-500/10">
          <MailCheck className="size-7 text-violet-500" />
        </div>

        <CardTitle className="text-foreground text-3xl font-bold tracking-tight">
          Verify your email
        </CardTitle>

        <p className="text-muted-foreground text-sm leading-relaxed">
          We have sent a 6-digit verification code to
          <span className="text-foreground ml-1 font-medium">{email}</span>.
        </p>

        {/* {form.formState.errors.root && (
          <div className="flex items-center justify-center gap-3 border border-dashed border-red-500 bg-red-50/20 px-3 py-2 text-sm text-red-500">
            <TriangleAlert className="size-4 shrink-0" />

            <span>{form.formState.errors.root.message}</span>
          </div>
        )} */}
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Verification Code</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="123456"
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      className="bg-background/50 border-border text-center text-lg tracking-[0.5em] focus-visible:border-violet-500"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription className="text-xs">
                    Enter the 6-digit code sent to your email.
                  </FormDescription>

                  <FormMessage className="text-xs tracking-wide" />
                </FormItem>
              )}
            />

            <SubmitButton
              className="h-11 w-full bg-violet-600 text-sm font-semibold hover:bg-violet-500"
              loadingText="Verifying..."
              pending={isPending}
              icon={BadgeCheck}
            >
              Verify email
            </SubmitButton>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="border-border/50 mb-2 flex justify-center border-t pt-4 pb-3">
        <p className="text-muted-foreground text-center text-sm">
          Did not receive the code?
          <ResendButton email={email} />
        </p>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmail;
