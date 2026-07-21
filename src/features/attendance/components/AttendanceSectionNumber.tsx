export function AttendanceSectionNumber({ n }: { n: number }) {
  return (
    <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold">
      {n}
    </span>
  );
}
