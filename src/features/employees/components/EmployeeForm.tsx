'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createEmployeeAction } from '@/server/employees/actions/create-employee.action';
import { updateEmployeeAction } from '@/server/employees/actions/update-employee.action';
import {
  type CreateEmployeeInput,
  createEmployeeSchema,
} from '@/server/employees/schemas/create-employee.schema';
import {
  type UpdateEmployeeInput,
  updateEmployeeSchema,
} from '@/server/employees/schemas/update-employee.schema';
import type { EmployeeResult } from '@/server/employees/types/action-results';

const NONE = 'none';

type SelectOption = { id: string; label: string };

// zodResolver types against the schema's pre-coercion input shape (hireDate is `unknown` here,
// since it's `z.coerce.date()`), not the CreateEmployeeInput/UpdateEmployeeInput output types
// the server actions expect — so the form itself is typed against the raw input shape.
type CreateEmployeeFormValues = z.input<typeof createEmployeeSchema>;
type UpdateEmployeeFormValues = z.input<typeof updateEmployeeSchema>;
type EmployeeFormValues = CreateEmployeeFormValues | UpdateEmployeeFormValues;
type EmployeeFormOutput = CreateEmployeeInput | UpdateEmployeeInput;

type EmployeeFormOptions = {
  departments: SelectOption[];
  positions: SelectOption[];
  managers: SelectOption[];
};

type CreateEmployeeFormProps = EmployeeFormOptions & {
  mode: 'create';
  onSuccess?: () => void;
  employee?: never;
};

type UpdateEmployeeFormProps = EmployeeFormOptions & {
  mode: 'update';
  onSuccess?: () => void;
  employee: EmployeeResult;
};

type EmployeeFormProps = CreateEmployeeFormProps | UpdateEmployeeFormProps;

function toDateInputValue(value: unknown) {
  if (!(value instanceof Date) && typeof value !== 'string') return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

export function EmployeeForm({
  mode,
  onSuccess,
  employee,
  departments,
  positions,
  managers,
}: EmployeeFormProps) {
  const [isPending, setIsPending] = useState(false);

  const isUpdateMode = mode === 'update';

  const form = useForm<EmployeeFormValues, unknown, EmployeeFormOutput>({
    resolver: zodResolver(isUpdateMode ? updateEmployeeSchema : createEmployeeSchema) as Resolver<
      EmployeeFormValues,
      unknown,
      EmployeeFormOutput
    >,
    defaultValues: isUpdateMode
      ? {
          employeeCode: employee.employeeCode,
          phone: employee.phone ?? '',
          hireDate: employee.hireDate,
          departmentId: employee.department?.id,
          positionId: employee.position?.id,
          managerId: employee.manager?.id,
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          employeeCode: '',
          phone: '',
          hireDate: new Date(),
          isActive: true,
        },
  });

  const onSubmit = async (data: CreateEmployeeInput | UpdateEmployeeInput) => {
    setIsPending(true);

    try {
      const result = isUpdateMode
        ? await updateEmployeeAction(employee.id, data)
        : await createEmployeeAction(data as CreateEmployeeInput);

      if (result.success) {
        toast.success(
          result.message ??
            (isUpdateMode ? 'Employee updated successfully!' : 'Employee invited successfully!'),
        );
        form.reset();
        onSuccess?.();
      } else {
        toast.error(
          result.message ??
            (isUpdateMode ? 'Failed to update employee.' : 'Failed to invite employee.'),
        );

        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && Array.isArray(messages) && messages.length > 0) {
              form.setError(field as keyof (CreateEmployeeInput & UpdateEmployeeInput), {
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

  const managerOptions = managers.filter((manager) =>
    isUpdateMode ? manager.id !== employee.id : true,
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isUpdateMode && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium tracking-wide">First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ada"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium tracking-wide">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lovelace"
                        {...field}
                        value={field.value ?? ''}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium tracking-wide">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ada@example.com"
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employeeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">Employee Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. EMP-001"
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
            name="hireDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">Hire Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={toDateInputValue(field.value)}
                    onChange={(event) => field.onChange(event.target.valueAsDate ?? undefined)}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium tracking-wide">Phone (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="555-0100"
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
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium tracking-wide">Department</FormLabel>
              <Select
                value={field.value ?? NONE}
                onValueChange={(value) => field.onChange(value === NONE ? undefined : value)}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NONE}>No department</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="positionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium tracking-wide">Position</FormLabel>
              <Select
                value={field.value ?? NONE}
                onValueChange={(value) => field.onChange(value === NONE ? undefined : value)}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NONE}>No position</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="managerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium tracking-wide">Manager</FormLabel>
              <Select
                value={field.value ?? NONE}
                onValueChange={(value) => field.onChange(value === NONE ? undefined : value)}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NONE}>No manager</SelectItem>
                  {managerOptions.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={isPending} size="lg" className="font-semibold">
            {isUpdateMode ? (
              <SaveIcon data-icon="inline-start" />
            ) : (
              <PlusIcon data-icon="inline-start" />
            )}

            {isPending
              ? isUpdateMode
                ? 'Updating...'
                : 'Inviting...'
              : isUpdateMode
                ? 'Update Employee'
                : 'Invite Employee'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
