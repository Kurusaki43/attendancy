import { Badge } from '@/components/ui/badge';

export function DepartmentStatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge className="rounded-sm bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400">
      <span className="size-1.5 shrink-0 rounded-full bg-green-500" />
      Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="rounded-sm">
      <span className="bg-muted-foreground size-1.5 shrink-0 rounded-full" />
      Inactive
    </Badge>
  );
}
