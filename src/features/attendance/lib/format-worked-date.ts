export function formatWorkedMinutes(workedMinutes: number) {
  const hours = Math.floor(workedMinutes / 60);
  const minutes = workedMinutes % 60;

  if (hours === 0) return `${minutes}m`;

  return `${hours}h ${minutes}m`;
}
