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

import { createDepartmentAction } from '../actions/create-department.action';
import { updateDepartmentAction } from '../actions/update-department.action';
import {
  type CreateDepartmentInput,
  createDepartmentSchema,
} from '../schemas/create-department.schema';
import {
  type UpdateDepartmentInput,
  updateDepartmentSchema,
} from '../schemas/update-department.schema';
import type { DepartmentResult } from '../types/action-results';

type CreateDepartmentFormProps = {
  mode: 'create';
  onSuccess?: () => void;
  department?: never;
};

type UpdateDepartmentFormProps = {
  mode: 'update';
  onSuccess?: () => void;
  department: DepartmentResult;
};

type DepartmentFormProps = CreateDepartmentFormProps | UpdateDepartmentFormProps;

export function DepartmentForm({ mode, onSuccess, department }: DepartmentFormProps) {
  const [isPending, setIsPending] = useState(false);

  const isUpdateMode = mode === 'update';

  const form = useForm<CreateDepartmentInput | UpdateDepartmentInput>({
    resolver: zodResolver(isUpdateMode ? updateDepartmentSchema : createDepartmentSchema),
    defaultValues: isUpdateMode
      ? {
          name: department.name,
          description: department.description ?? '',
          isActive: department.isActive,
        }
      : {
          name: '',
          description: '',
          isActive: true,
        },
  });

  const isDirty = Boolean(
    form.formState.dirtyFields.name || form.formState.dirtyFields.description,
  );

  const onSubmit = async (data: CreateDepartmentInput | UpdateDepartmentInput) => {
    setIsPending(true);

    try {
      const result = isUpdateMode
        ? await updateDepartmentAction(department.id, data)
        : await createDepartmentAction(data as CreateDepartmentInput);

      if (result.success) {
        toast.success(
          result.message ??
            (isUpdateMode
              ? 'Department updated successfully!'
              : 'Department created successfully!'),
        );
        form.reset();
        onSuccess?.();
      } else {
        toast.error(
          result.message ??
            (isUpdateMode ? 'Failed to update department.' : 'Failed to create department.'),
        );

        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && Array.isArray(messages) && messages.length > 0) {
              form.setError(field as keyof (CreateDepartmentInput & UpdateDepartmentInput), {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name" className="font-medium tracking-wide">
                Department Name
              </FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Enter department name"
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
                  placeholder="Enter department description"
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
                ? 'Update Department'
                : 'Create Department'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
