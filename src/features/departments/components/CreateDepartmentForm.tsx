'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, CircleCheck, Lightbulb, ListTree, PlusIcon } from 'lucide-react';
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
import {
  type CreateDepartmentInput,
  createDepartmentSchema,
} from '@/server/departments/schemas/create-department.schema';

import {
  DEPARTMENT_COLOR_OPTIONS,
  DEPARTMENT_ICON_MAP,
  DEPARTMENT_ICON_OPTIONS,
} from '../lib/department-visuals';

const NONE = 'none';
const DESCRIPTION_MAX_LENGTH = 500;

const TIPS = [
  {
    title: 'Use a clear and concise name',
    description: 'Make it easy to understand for everyone',
  },
  { title: 'Choose a unique code', description: 'Use short codes for easy reference' },
  {
    title: 'Pick a memorable icon and color',
    description: 'Helps the department stand out at a glance',
  },
  {
    title: 'Organize with parent departments',
    description: 'Use sub-departments for better structure',
  },
];

type ParentOption = { id: string; label: string };

type CreateDepartmentFormProps = {
  parentOptions: ParentOption[];
};

export function CreateDepartmentForm({ parentOptions }: CreateDepartmentFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<CreateDepartmentInput>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
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

  const onSubmit = async (data: CreateDepartmentInput) => {
    setIsPending(true);

    try {
      const result = await createDepartmentAction(data);

      if (result.success) {
        toast.success(result.message ?? 'Department created successfully!');
        router.push('/dashboard/departments');
        router.refresh();
      } else {
        toast.error(result.message ?? 'Failed to create department.');

        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && Array.isArray(messages) && messages.length > 0) {
              form.setError(field as keyof CreateDepartmentInput, {
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
                  <CardDescription>Enter the details for the new department</CardDescription>
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

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium tracking-wide">
                          Department Color
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'size-9 shrink-0 rounded-md border',
                              field.value || 'bg-muted',
                            )}
                          />
                          <FormControl>
                            <Input
                              placeholder="bg-violet-500"
                              {...field}
                              value={field.value ?? ''}
                              disabled={isPending}
                            />
                          </FormControl>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {DEPARTMENT_COLOR_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              title={option.label}
                              onClick={() => field.onChange(option.value)}
                              disabled={isPending}
                              className={cn(
                                'size-5 rounded-full transition-transform hover:scale-110',
                                option.value,
                                field.value === option.value &&
                                  'ring-ring ring-offset-background ring-2 ring-offset-2',
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Pick a swatch or type a Tailwind class (e.g. bg-violet-500)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            <Card>
              <CardHeader>
                <CardTitle>Department Icon</CardTitle>
                <CardDescription>Choose an icon to represent this department</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <div className="grid grid-cols-5 gap-2">
                      {DEPARTMENT_ICON_OPTIONS.map((option) => {
                        const OptionIcon = option.icon;
                        const selected = field.value === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            title={option.label}
                            disabled={isPending}
                            onClick={() => field.onChange(selected ? undefined : option.value)}
                            className={cn(
                              'text-muted-foreground hover:bg-muted flex aspect-square items-center justify-center rounded-md border transition-colors',
                              selected && 'border-primary bg-primary/10 text-primary',
                            )}
                          >
                            <OptionIcon className="size-6" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center gap-2 space-y-0">
                <Lightbulb className="size-4 text-amber-500" />
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {TIPS.map((tip) => (
                  <div key={tip.title} className="flex items-start gap-2">
                    <CircleCheck className="text-primary mt-0.5 size-4 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{tip.title}</p>
                      <p className="text-muted-foreground text-xs">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

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
            <PlusIcon data-icon="inline-start" />
            {isPending ? 'Creating...' : 'Create Department'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
