import { addHours, addMinutes, isWeekend, startOfDay, subDays } from 'date-fns';

import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const DAYS_OF_HISTORY = 14;
const CLOCK_IN_HOUR = 9;
const CLOCK_OUT_HOUR = 17;
const ABSENCE_FREQUENCY = 8; // roughly one skipped workday out of every 8

// Deterministic pseudo-random hash so rerunning the seed on the same day always produces the
// same attendance history instead of a different one on every `pnpm db:seed`.
function seededJitter(seed: string, max: number) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(hash) % max;
}

function isSeededWorkday(date: Date, seedKey: string) {
  return !isWeekend(date) && seededJitter(seedKey, ABSENCE_FREQUENCY) !== 0;
}

export async function seedAttendance() {
  logger.info('🌱 Seeding attendance...');

  const employees = await prisma.employee.findMany({
    where: { employmentStatus: 'ACTIVE' },
    select: { id: true, employeeCode: true },
  });

  const today = startOfDay(new Date());

  for (const employee of employees) {
    for (let daysAgo = 1; daysAgo <= DAYS_OF_HISTORY; daysAgo++) {
      const date = subDays(today, daysAgo);
      const seedKey = `${employee.employeeCode}-${daysAgo}`;

      if (!isSeededWorkday(date, seedKey)) continue;

      const firstClockIn = addMinutes(
        addHours(date, CLOCK_IN_HOUR),
        seededJitter(`${seedKey}-in`, 20),
      );
      const lastClockOut = addMinutes(
        addHours(date, CLOCK_OUT_HOUR),
        seededJitter(`${seedKey}-out`, 30),
      );
      const workedMinutes = Math.round((lastClockOut.getTime() - firstClockIn.getTime()) / 60_000);

      const attendance = await prisma.attendance.upsert({
        where: { employeeId_date: { employeeId: employee.id, date } },
        update: { firstClockIn, lastClockOut, workedMinutes, status: 'PRESENT' },
        create: {
          employeeId: employee.id,
          date,
          firstClockIn,
          lastClockOut,
          workedMinutes,
          status: 'PRESENT',
        },
      });

      // AttendanceEvent has no natural unique key of its own, so replace the pair on every
      // reseed rather than accumulating duplicates.
      await prisma.attendanceEvent.deleteMany({ where: { attendanceId: attendance.id } });
      await prisma.attendanceEvent.createMany({
        data: [
          { attendanceId: attendance.id, type: 'CLOCK_IN', occurredAt: firstClockIn, method: 'QR' },
          {
            attendanceId: attendance.id,
            type: 'CLOCK_OUT',
            occurredAt: lastClockOut,
            method: 'QR',
          },
        ],
      });
    }

    logger.debug(`Attendance synced: ${employee.employeeCode}`);
  }

  logger.info('✅ Attendance seeded successfully');
}
