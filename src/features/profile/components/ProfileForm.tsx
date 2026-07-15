'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AvatarUploader } from '@/features/profile/components/AvatarUploader';
import { updateProfileAction } from '@/server/profile/actions/update-profile.action';
import {
  type UpdateProfileInput,
  updateProfileSchema,
} from '@/server/profile/schemas/update-profile.schema';
import type { ProfileResult } from '@/server/profile/types/action-results';

type ProfileFormProps = {
  profile: ProfileResult;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar ?? '',
    },
  });

  const isDirty = Boolean(
    form.formState.dirtyFields.firstName ||
    form.formState.dirtyFields.lastName ||
    form.formState.dirtyFields.avatar,
  );

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsPending(true);

    try {
      const result = await updateProfileAction(data);

      if (result.success) {
        toast.success(result.message ?? 'Profile updated successfully!');
        form.reset(data);
        router.refresh();
      } else {
        toast.error(result.message ?? 'Failed to update profile.');

        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(field as keyof UpdateProfileInput, {
                type: 'manual',
                message: messages[0],
              });
            }
          });
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
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium tracking-wide">Profile Photo</FormLabel>
              <FormControl>
                <AvatarUploader
                  firstName={profile.firstName}
                  lastName={profile.lastName}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="firstName" className="font-medium tracking-wide">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="lastName" className="font-medium tracking-wide">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending || !isDirty}
            size="lg"
            className="font-semibold"
          >
            <SaveIcon data-icon="inline-start" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
