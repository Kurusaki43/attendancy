import { CirclePlus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AddDepartmentButtonProps = {
  className?: string;
};

export function AddDepartmentButton({ className }: AddDepartmentButtonProps) {
  return (
    <Button
      size="lg"
      nativeButton={false}
      className={cn(
        'bg-primary flex h-10 transform items-center font-bold capitalize duration-300 hover:scale-105',
        className,
      )}
      render={<Link href="/dashboard/departments/create" />}
    >
      <CirclePlus data-icon="inline-start" />
      Add Department
    </Button>
  );
}
