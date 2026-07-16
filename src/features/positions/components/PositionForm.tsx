'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, SaveIcon } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { createPositionAction } from '@/server/positions/actions/create-position.action';
import { updatePositionAction } from '@/server/positions/actions/update-position.action';
import {
  type CreatePositionInput,
  createPositionSchema,
} from '@/server/positions/schemas/create-position.schema';
import {
  type UpdatePositionInput,
  updatePositionSchema,
} from '@/server/positions/schemas/update-position.schema';
import type { PositionResult } from '@/server/positions/types/action-results';

type CreatePositionFormProps = {
  mode: 'create';
  onSuccess?: () => void;
  position?: never;
};

type UpdatePositionFormProps = {
  mode: 'update';
  onSuccess?: () => void;
  position: PositionResult;
};

type PositionFormProps = CreatePositionFormProps | UpdatePositionFormProps;

export function PositionForm({ mode, onSuccess, position }: PositionFormProps) {
  const [isPending, setIsPending] = useState(false);

  const isUpdateMode = mode === 'update';

  const form = useForm<CreatePositionInput | UpdatePositionInput>({
    resolver: zodResolver(isUpdateMode ? updatePositionSchema : createPositionSchema),
    defaultValues: isUpdateMode
      ? {
          title: position.title,
          code: position.code,
          description: position.description ?? '',
          isActive: position.isActive,
        }
      : {
          title: '',
          code: '',
          description: '',
          isActive: true,
        },
  });

  const isDirty = Boolean(
    form.formState.dirtyFields.title ||
    form.formState.dirtyFields.code ||
    form.formState.dirtyFields.description,
  );

  const onSubmit = async (data: CreatePositionInput | UpdatePositionInput) => {
    setIsPending(true);

    try {
      const result = isUpdateMode
        ? await updatePositionAction(position.id, data)
        : await createPositionAction(data as CreatePositionInput);

      if (result.success) {
        toast.success(
          result.message ??
            (isUpdateMode ? 'Position updated successfully!' : 'Position created successfully!'),
        );
        form.reset();
        onSuccess?.();
      } else {
        toast.error(
          result.message ??
            (isUpdateMode ? 'Failed to update position.' : 'Failed to create position.'),
        );

        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && Array.isArray(messages) && messages.length > 0) {
              form.setError(field as keyof (CreatePositionInput & UpdatePositionInput), {
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title" className="font-medium tracking-wide">
                Position Title
              </FormLabel>
              <FormControl>
                <Input
                  id="title"
                  placeholder="Enter position title"
                  {...field}
                  value={field.value ?? ''}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="code" className="font-medium tracking-wide">
                Position Code
              </FormLabel>
              <FormControl>
                <Input
                  id="code"
                  placeholder="e.g. SWE"
                  {...field}
                  value={field.value ?? ''}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description" className="font-medium tracking-wide">
                Description (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Enter position description"
                  rows={3}
                  {...field}
                  value={field.value ?? ''}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="submit"
            disabled={isPending || !isDirty}
            size="lg"
            className="font-semibold"
          >
            {isUpdateMode ? (
              <SaveIcon data-icon="inline-start" />
            ) : (
              <PlusIcon data-icon="inline-start" />
            )}

            {isPending
              ? isUpdateMode
                ? 'Updating...'
                : 'Creating...'
              : isUpdateMode
                ? 'Update Position'
                : 'Create Position'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
