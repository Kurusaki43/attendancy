'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import RHFInput from '@/components/shared/RHFInput';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { Form } from '@/components/ui/form';
import { changePasswordAction } from '@/server/profile/actions/change-password.action';
import {
  type ChangePasswordFormInput,
  changePasswordFormSchema,
} from '@/server/profile/schemas/change-password.schema';

export function ChangePasswordForm() {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [currentPassword, newPassword, confirmPassword] = form.watch([
    'currentPassword',
    'newPassword',
    'confirmPassword',
  ]);
  const isFormIncomplete = !currentPassword || !newPassword || !confirmPassword;

  const onSubmit = async (data: ChangePasswordFormInput) => {
    setIsPending(true);

    try {
      const result = await changePasswordAction(data);

      if (result.success) {
        toast.success(result.message ?? 'Password changed successfully!');
        form.reset();
      } else {
        toast.error(result.message ?? 'Failed to change password.');

        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(field as keyof ChangePasswordFormInput, {
                type: 'manual',
                message: messages[0],
              });
            }
          });
        } else {
          form.setError('currentPassword', { type: 'manual', message: result.message });
        }
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInput
          control={form.control}
          name="currentPassword"
          label="Current Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          icon={Lock}
          disabled={isPending}
        />

        <RHFInput
          control={form.control}
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          icon={Lock}
          disabled={isPending}
        />

        <RHFInput
          control={form.control}
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          icon={Lock}
          disabled={isPending}
        />

        <div className="flex justify-end pt-2">
          <SubmitButton
            pending={isPending}
            disabled={isFormIncomplete}
            loadingText="Changing password..."
            icon={KeyRound}
            className="h-10 font-semibold"
          >
            Change Password
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
