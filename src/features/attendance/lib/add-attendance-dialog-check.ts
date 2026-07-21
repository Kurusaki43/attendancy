import type { AttendanceEmployeeOption } from './attendance-employee-option';

export function isFutureDate(candidate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(candidate);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate.getTime() > today.getTime();
}

export function isBeforeHireDate(candidate: Date, hireDate: Date): boolean {
  const compareDate = new Date(candidate);
  compareDate.setHours(0, 0, 0, 0);
  const compareHireDate = new Date(hireDate);
  compareHireDate.setHours(0, 0, 0, 0);
  return compareDate.getTime() < compareHireDate.getTime();
}

export function getEmployeeStatusError(employee: AttendanceEmployeeOption): string | null {
  if (employee.employmentStatus === 'TERMINATED') {
    return 'This employee is terminated and cannot have attendance recorded.';
  }
  if (employee.userStatus !== 'ACTIVE') {
    return "This employee's account is not active.";
  }
  return null;
}
