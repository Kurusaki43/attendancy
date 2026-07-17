'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, ListTree, PlusIcon, SaveIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { createDepartmentAction } from '@/server/departments/actions/create-department.action';
import { updateDepartmentAction } from '@/server/departments/actions/update-department.action';
import {
  type CreateDepartmentInput,
  createDepartmentSchema,
} from '@/server/departments/schemas/create-department.schema';
import {
  type UpdateDepartmentInput,
  updateDepartmentSchema,
} from '@/server/departments/schemas/update-department.schema';
import type { DepartmentResult } from '@/server/departments/types/action-results';

import { DEPARTMENT_ICON_MAP } from '../lib/department-visuals';
import { DepartmentColorPicker } from './DepartmentColorPicker';
import { DepartmentIconPicker } from './DepartmentIconPicker';
import { DepartmentTips } from './DepartmentTips';

const NONE = 'none';
const DESCRIPTION_MAX_LENGTH = 500;

type ParentOption = { id: string; label: string };

type CreateDepartmentFormProps = {
  mode: 'create';
  parentOptions: ParentOption[];
  department?: never;
};

type UpdateDepartmentFormProps = {
  mode: 'update';
  parentOptions: ParentOption[];
  department: DepartmentResult;
};

type DepartmentFormProps = CreateDepartmentFormProps | UpdateDepartmentFormProps;

export function DepartmentForm({ mode, parentOptions, department }: DepartmentFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const isUpdateMode = mode === 'update';

  const form = useForm<CreateDepartmentInput | UpdateDepartmentInput>({
    resolver: zodResolver(isUpdateMode ? updateDepartmentSchema : createDepartmentSchema),
    defaultValues: isUpdateMode
      ? {
          name: department.name,
          code: department.code,
          description: department.description ?? '',
          icon: department.icon ?? undefined,
          color: department.color ?? undefined,
          parentId: department.parentId ?? undefined,
          isActive: department.isActive,
        }
      : {
          name: '',
          code: '',
          description: '',
          icon: undefined,
          color: undefined,
          parentId: undefined,
          isActive: true,
        },
  });

  const [name, code, icon, color, parentId, isActive] = form.watch([
    'name',
    'code',
    'icon',
    'color',
    'parentId',
    'isActive',
  ]);

  const SelectedIcon = icon ? DEPARTMENT_ICON_MAP.get(icon) : undefined;
  const parentLabel = parentOptions.find((option) => option.id === parentId)?.label;

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
        router.push('/dashboard/departments');
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <CardTitle>Department Information</CardTitle>
                  <CardDescription>
                    {isUpdateMode
                      ? 'Update the details for this department'
                      : 'Enter the details for the new department'}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium tracking-wide">
                          Department Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter department name"
                            {...field}
                            value={field.value ?? ''}
                            disabled={isPending}
                          />
                        </FormControl>
                        <p className="text-muted-foreground text-xs">
                          Example: Engineering, Human Resources
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium tracking-wide">
                          Department Code <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter department code"
                            {...field}
                            value={field.value ?? ''}
                            disabled={isPending}
                          />
                        </FormControl>
                        <p className="text-muted-foreground text-xs">
                          Short code for the department (e.g., ENG, HR)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium tracking-wide">
                        Description (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter department description (optional)"
                          rows={4}
                          maxLength={DESCRIPTION_MAX_LENGTH}
                          {...field}
                          value={field.value ?? ''}
                          disabled={isPending}
                        />
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-xs">
                          Brief description of the department and its purpose
                        </p>
                        <p className="text-muted-foreground text-xs tabular-nums">
                          {(field.value ?? '').length} / {DESCRIPTION_MAX_LENGTH}
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium tracking-wide">
                          Parent Department
                        </FormLabel>
                        <Select
                          value={field.value ?? NONE}
                          onValueChange={(value) =>
                            field.onChange(value === NONE ? undefined : value)
                          }
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select parent department">
                                {(selected: string) =>
                                  selected === NONE
                                    ? 'No parent department'
                                    : parentOptions.find((option) => option.id === selected)?.label
                                }
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={NONE}>No parent department</SelectItem>
                            {parentOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-muted-foreground text-xs">
                          Choose a parent department if this is a sub-department
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DepartmentColorPicker control={form.control} disabled={isPending} />
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="font-medium tracking-wide">Status</FormLabel>
                        <p className="text-muted-foreground text-xs">Set the department status</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? true}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <DepartmentIconPicker control={form.control} disabled={isPending} />

            <DepartmentTips />

            <Card>
              <CardHeader className="flex-row items-center gap-2 space-y-0">
                <ListTree className="size-4" />
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-md text-white',
                      color || 'bg-muted text-muted-foreground',
                    )}
                  >
                    {SelectedIcon ? (
                      <SelectedIcon className="size-4" />
                    ) : (
                      <Building2 className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{name || 'Department Name'}</p>
                    <p className="text-muted-foreground truncate text-xs">{code || 'CODE'}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Parent Department</span>
                  <span className="font-medium">{parentLabel ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={isActive ? 'default' : 'secondary'}>
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isPending}
            nativeButton={false}
            render={<Link href="/dashboard/departments" />}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" className="font-semibold" disabled={isPending}>
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
