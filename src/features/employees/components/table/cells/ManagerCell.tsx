import type { EmployeeResult } from '@/server/employees/types/action-results';

export function ManagerCell({ manager }: { manager: EmployeeResult['manager'] }) {
  return (
    <span className="text-muted-foreground">
      {manager ? (
        `${manager.user.firstName} ${manager.user.lastName}`
      ) : (
        <span className="italic opacity-50">None</span>
      )}
    </span>
  );
}
