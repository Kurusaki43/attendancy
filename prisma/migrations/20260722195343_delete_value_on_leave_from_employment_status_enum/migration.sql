/*
  Warnings:

  - The values [ON_LEAVE] on the enum `EmploymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmploymentStatus_new" AS ENUM ('ACTIVE', 'TERMINATED');
ALTER TABLE "public"."Employee" ALTER COLUMN "employmentStatus" DROP DEFAULT;
ALTER TABLE "Employee" ALTER COLUMN "employmentStatus" TYPE "EmploymentStatus_new" USING ("employmentStatus"::text::"EmploymentStatus_new");
ALTER TYPE "EmploymentStatus" RENAME TO "EmploymentStatus_old";
ALTER TYPE "EmploymentStatus_new" RENAME TO "EmploymentStatus";
DROP TYPE "public"."EmploymentStatus_old";
ALTER TABLE "Employee" ALTER COLUMN "employmentStatus" SET DEFAULT 'ACTIVE';
COMMIT;
