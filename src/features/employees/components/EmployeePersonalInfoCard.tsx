import { User as UserIcon } from 'lucide-react';
import { type Control, useWatch } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type CreateEmployeeFormValues,
  type EmployeeFormOutput,
  type EmployeeFormValues,
  NONE,
  toDateInputValue,
} from '@/features/employees/lib/employee-form';
import { AvatarUploader } from '@/features/profile/components/AvatarUploader';
import type { EmployeeResult } from '@/server/employees/types/action-results';

type EmployeePersonalInfoCardProps = {
  control: Control<EmployeeFormValues, unknown, EmployeeFormOutput>;
  isPending: boolean;
} & ({ mode: 'create'; employee?: never } | { mode: 'update'; employee: EmployeeResult });

export function EmployeePersonalInfoCard({
  control,
  isPending,
  mode,
  employee,
}: EmployeePersonalInfoCardProps) {
  const isUpdateMode = mode === 'update';

  const createControl = control as unknown as Control<CreateEmployeeFormValues>;
  const [firstName, lastName] = useWatch({
    control: createControl,
    name: ['firstName', 'lastName'],
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
          <UserIcon className="size-5" />
        </div>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium tracking-wide">Profile Photo (Optional)</FormLabel>
              <FormControl>
                <AvatarUploader
                  firstName={isUpdateMode ? employee.user.firstName : (firstName ?? '')}
                  lastName={isUpdateMode ? employee.user.lastName : (lastName ?? '')}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isUpdateMode ? (
            <>
              <div className="space-y-2">
                <FormLabel className="font-medium tracking-wide">First Name</FormLabel>
                <Input value={employee.user.firstName} disabled readOnly />
              </div>
              <div className="space-y-2">
                <FormLabel className="font-medium tracking-wide">Last Name</FormLabel>
                <Input value={employee.user.lastName} disabled readOnly />
              </div>
              <div className="space-y-2">
                <FormLabel className="font-medium tracking-wide">Email Address</FormLabel>
                <Input value={employee.user.email} disabled readOnly />
              </div>
            </>
          ) : (
            <>
              <FormField
                control={createControl}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium tracking-wide">
                      First Name <span className="text-destructive">*</span>
                    </FormLabel>
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
                control={createControl}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium tracking-wide">
                      Last Name <span className="text-destructive">*</span>
                    </FormLabel>
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

              <FormField
                control={createControl}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium tracking-wide">
                      Email Address <span className="text-destructive">*</span>
                    </FormLabel>
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

          <FormField
            control={control}
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
            control={control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">
                  Date of Birth (Optional)
                </FormLabel>
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

          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">Gender (Optional)</FormLabel>
                <Select
                  value={field.value ?? NONE}
                  onValueChange={(value) => field.onChange(value === NONE ? undefined : value)}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NONE}>Not specified</SelectItem>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium tracking-wide">Address (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St, City, Country"
                  {...field}
                  value={field.value ?? ''}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
