import { Briefcase } from 'lucide-react';
import type { Control } from 'react-hook-form';

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
  type EmployeeFormOutput,
  type EmployeeFormValues,
  NONE,
  type SelectOption,
  toDateInputValue,
} from '@/features/employees/lib/employee-form';

type EmployeeEmploymentInfoCardProps = {
  control: Control<EmployeeFormValues, unknown, EmployeeFormOutput>;
  isPending: boolean;
  departments: SelectOption[];
  positions: SelectOption[];
  managerOptions: SelectOption[];
};

export function EmployeeEmploymentInfoCard({
  control,
  isPending,
  departments,
  positions,
  managerOptions,
}: EmployeeEmploymentInfoCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
          <Briefcase className="size-5" />
        </div>
        <CardTitle>Employment Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={control}
            name="employeeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">
                  Employee Code <span className="text-destructive">*</span>
                </FormLabel>
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
            control={control}
            name="hireDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">
                  Hire Date <span className="text-destructive">*</span>
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
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">Status</FormLabel>
                <Select
                  value={(field.value ?? true) ? 'active' : 'inactive'}
                  onValueChange={(value) => field.onChange(value === 'active')}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">Department (Optional)</FormLabel>
                <Select
                  value={field.value ?? NONE}
                  onValueChange={(value) => field.onChange(value === NONE ? undefined : value)}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department">
                        {(selected: string) =>
                          selected === NONE
                            ? 'No department'
                            : departments.find((department) => department.id === selected)?.label
                        }
                      </SelectValue>
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
            control={control}
            name="positionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">Position (Optional)</FormLabel>
                <Select
                  value={field.value ?? NONE}
                  onValueChange={(value) => field.onChange(value === NONE ? undefined : value)}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select position">
                        {(selected: string) =>
                          selected === NONE
                            ? 'No position'
                            : positions.find((position) => position.id === selected)?.label
                        }
                      </SelectValue>
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
            control={control}
            name="managerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">Manager (Optional)</FormLabel>
                <Select
                  value={field.value ?? NONE}
                  onValueChange={(value) => field.onChange(value === NONE ? undefined : value)}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select manager">
                        {(selected: string) =>
                          selected === NONE
                            ? 'No manager'
                            : managerOptions.find((manager) => manager.id === selected)?.label
                        }
                      </SelectValue>
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
        </div>
      </CardContent>
    </Card>
  );
}
