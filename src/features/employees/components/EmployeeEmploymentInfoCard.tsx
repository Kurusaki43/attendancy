import { Briefcase, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { toast } from 'sonner';

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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  type EmployeeFormOutput,
  type EmployeeFormValues,
  NONE,
  type SelectOption,
  toDateInputValue,
} from '@/features/employees/lib/employee-form';
import {
  EMPLOYMENT_STATUS_LABELS,
  EMPLOYMENT_STATUSES,
} from '@/features/employees/lib/employment-status';
import { generateEmployeeCodeAction } from '@/server/employees/actions/generate-employee-code.action';

type EmployeeEmploymentInfoCardProps = {
  mode: 'create' | 'update';
  control: Control<EmployeeFormValues, unknown, EmployeeFormOutput>;
  isPending: boolean;
  departments: SelectOption[];
  positions: SelectOption[];
  managerOptions: SelectOption[];
};

export function EmployeeEmploymentInfoCard({
  mode,
  control,
  isPending,
  departments,
  positions,
  managerOptions,
}: EmployeeEmploymentInfoCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

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
                  <div className="relative">
                    <Input
                      placeholder="e.g. EMP-00001"
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                      className={mode === 'create' ? 'pe-9' : undefined}
                    />
                    {mode === 'create' && (
                      <Tooltip>
                        <TooltipTrigger
                          type="button"
                          aria-label="Generate employee code"
                          disabled={isPending || isGenerating}
                          onClick={async () => {
                            setIsGenerating(true);
                            try {
                              const result = await generateEmployeeCodeAction();
                              if (result.success) {
                                field.onChange(result.data.employeeCode);
                              } else {
                                toast.error(result.message ?? 'Failed to generate employee code.');
                              }
                            } catch {
                              toast.error('An unexpected error occurred.');
                            } finally {
                              setIsGenerating(false);
                            }
                          }}
                          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                        >
                          {isGenerating ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <RefreshCw className="size-4" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>Click to auto-generate a unique code</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
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
            name="employmentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium tracking-wide">Employment Status</FormLabel>
                <Select
                  value={field.value ?? 'ACTIVE'}
                  onValueChange={(value) => field.onChange(value)}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EMPLOYMENT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {EMPLOYMENT_STATUS_LABELS[status]}
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
