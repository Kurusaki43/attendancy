import { SessionCardSkeleton } from '@/features/sessions/components/SessionCardSkeleton';

export default function SettingsLoading() {
  return (
    <div className="space-y-4">
      <div className="pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Devices currently signed into your account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SessionCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
