'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, SaveIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type Control, type Resolver, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { EmployeeAccountInvitationCard } from '@/features/employees/components/EmployeeAccountInvitationCard';
import { EmployeeEmploymentInfoCard } from '@/features/employees/components/EmployeeEmploymentInfoCard';
import { EmployeePersonalInfoCard } from '@/features/employees/components/EmployeePersonalInfoCard';
import { EmployeeSummaryCard } from '@/features/employees/components/EmployeeSummaryCard';
import type {
  CreateEmployeeFormValues,
  EmployeeFormOutput,
  EmployeeFormValues,
  SelectOption,
} from '@/features/employees/lib/employee-form';
import { getBrowserLocaleAndTimezone } from '@/lib/browser-locale';
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

type EmployeeFormOptions = {
  departments: SelectOption[];
  positions: SelectOption[];
  managers: SelectOption[];
};

type CreateEmployeeFormProps = EmployeeFormOptions & {
  mode: 'create';
  employee?: never;
};

type UpdateEmployeeFormProps = EmployeeFormOptions & {
  mode: 'update';
  employee: EmployeeResult;
};

type EmployeeFormProps = CreateEmployeeFormProps | UpdateEmployeeFormProps;

export function EmployeeForm({
  mode,
  employee,
  departments,
  positions,
  managers,
}: EmployeeFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const isUpdateMode = mode === 'update';
  const canEditIdentity = !isUpdateMode || employee.user.status === 'INVITED';

  const form = useForm<EmployeeFormValues, unknown, EmployeeFormOutput>({
    resolver: zodResolver(isUpdateMode ? updateEmployeeSchema : createEmployeeSchema) as Resolver<
      EmployeeFormValues,
      unknown,
      EmployeeFormOutput
    >,
    defaultValues: {
      firstName: employee?.user.firstName ?? '',
      lastName: employee?.user.lastName ?? '',
      email: employee?.user.email ?? '',
      employeeCode: employee?.employeeCode ?? '',
      phone: employee?.phone ?? '',
      hireDate: employee?.hireDate,
      gender: employee?.gender ?? undefined,
      birthDate: employee?.birthDate ?? undefined,
      address: employee?.address ?? '',
      departmentId: employee?.department?.id,
      positionId: employee?.position?.id,
      managerId: employee?.manager?.id,
      employmentStatus: employee?.employmentStatus ?? 'ACTIVE',
      avatar: employee?.user.avatar ?? '',
    },
  });

  const { dirtyFields } = form.formState;

  const onSubmit = async (data: CreateEmployeeInput | UpdateEmployeeInput) => {
    setIsPending(true);

    const payload = { ...data };
    if (!dirtyFields.avatar) {
      delete payload.avatar;
    }

    if (isUpdateMode && !canEditIdentity) {
      const lockedPayload = payload as UpdateEmployeeInput;
      delete lockedPayload.firstName;
      delete lockedPayload.lastName;
      delete lockedPayload.email;
    }

    try {
      const result = isUpdateMode
        ? await updateEmployeeAction(employee.id, payload)
        : await createEmployeeAction({
            ...(payload as CreateEmployeeInput),
            ...getBrowserLocaleAndTimezone(),
          });

      if (result.success) {
        toast.success(
          result.message ??
            (isUpdateMode ? 'Employee updated successfully!' : 'Employee invited successfully!'),
        );
        router.push('/dashboard/employees');
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

  const watchedEmail = useWatch({
    control: form.control as unknown as Control<CreateEmployeeFormValues>,
    name: 'email',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 xl:col-span-2">
            {isUpdateMode ? (
              <EmployeePersonalInfoCard
                mode="update"
                employee={employee}
                control={form.control}
                isPending={isPending}
              />
            ) : (
              <EmployeePersonalInfoCard
                mode="create"
                control={form.control}
                isPending={isPending}
              />
            )}

            <EmployeeEmploymentInfoCard
              mode={mode}
              control={form.control}
              isPending={isPending}
              departments={departments}
              positions={positions}
              managerOptions={managerOptions}
            />
          </div>

          {/* Right column */}
          <div className="mx-auto w-full max-w-[550px] space-y-6 xl:max-w-full">
            {isUpdateMode ? (
              <EmployeeSummaryCard
                mode="update"
                employee={employee}
                control={form.control}
                departments={departments}
                positions={positions}
                managerOptions={managerOptions}
              />
            ) : (
              <EmployeeSummaryCard
                mode="create"
                control={form.control}
                departments={departments}
                positions={positions}
                managerOptions={managerOptions}
              />
            )}

            {!isUpdateMode && <EmployeeAccountInvitationCard email={watchedEmail ?? ''} />}
          </div>
        </div>

        <div className="flex justify-center gap-2 xl:justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isPending}
            nativeButton={false}
            render={<Link href="/dashboard/employees" />}
          >
            Cancel
          </Button>
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
