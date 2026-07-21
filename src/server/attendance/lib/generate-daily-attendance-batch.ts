import { AttendanceStatus } from '@/generated/prisma/enums';
import { attendanceRepository } from '@/server/attendance/repositories/attendance.repository';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';

const BATCH_SIZE = 500;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

/** Cursor-paginated (not skip/take — see employeeRepository.findActiveEmployeeIds) collection of
 *  every currently-active employee's id. */
export async function loadAllActiveEmployeeIds(): Promise<string[]> {
  const employeeIds: string[] = [];
  let cursor: string | undefined;

  while (true) {
    const page = await employeeRepository.findActiveEmployeeIds({ cursor, take: BATCH_SIZE });

    if (page.length === 0) {
      break;
    }

    employeeIds.push(...page);

    if (page.length < BATCH_SIZE) {
      break;
    }

    cursor = page[page.length - 1];
  }

  return employeeIds;
}

/** Which of the given employeeIds already have an attendance row for attendanceDate, checked in
 *  bounded-size chunks rather than one unbounded IN (...) query. */
export async function loadEmployeeIdsWithAttendance(
  attendanceDate: Date,
  employeeIds: string[],
): Promise<Set<string>> {
  const found = new Set<string>();

  for (const batch of chunk(employeeIds, BATCH_SIZE)) {
    const existing = await attendanceRepository.findExistingEmployeeIdsForDate(
      attendanceDate,
      batch,
    );
    existing.forEach((employeeId) => found.add(employeeId));
  }

  return found;
}

/** Creates ABSENT rows for the given employeeIds in bounded-size chunks, returning the total
 *  DB-confirmed insert count (skipDuplicates means this can be lower than employeeIds.length). */
export async function createAbsentAttendance(
  employeeIds: string[],
  attendanceDate: Date,
): Promise<number> {
  let created = 0;

  for (const batch of chunk(employeeIds, BATCH_SIZE)) {
    const { count } = await attendanceRepository.createMany(
      batch.map((employeeId) => ({
        employeeId,
        date: attendanceDate,
        status: AttendanceStatus.ABSENT,
        completionStatus: null,
      })),
    );
    created += count;
  }

  return created;
}
