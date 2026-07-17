import { CirclePlus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function AddDepartmentButton() {
  return (
    <Button
      size="lg"
      nativeButton={false}
      className="bg-primary flex h-10 transform items-center font-bold capitalize duration-300 hover:scale-105"
      render={<Link href="/dashboard/departments/create" />}
    >
      <CirclePlus data-icon="inline-start" />
      Add Department
    </Button>
  );
}
