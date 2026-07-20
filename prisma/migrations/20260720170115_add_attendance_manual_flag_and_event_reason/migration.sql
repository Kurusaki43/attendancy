-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "hasManualChanges" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "AttendanceEvent" ADD COLUMN     "reason" TEXT;
