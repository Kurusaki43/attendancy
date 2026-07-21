-- CreateEnum
CREATE TYPE "AttendanceCompletionStatus" AS ENUM ('COMPLETE', 'INCOMPLETE');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "completionStatus" "AttendanceCompletionStatus";
