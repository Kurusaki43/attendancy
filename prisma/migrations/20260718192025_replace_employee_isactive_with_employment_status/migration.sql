-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'TERMINATED');

-- Add the new column nullable first so existing rows don't need a single blanket default,
-- backfill it from the boolean it replaces, then lock it down to match the schema.
-- isActive: true -> ACTIVE, false -> TERMINATED (closest existing equivalent to "not active";
-- ON_LEAVE has no boolean precedent and is never backfilled into).
ALTER TABLE "Employee" ADD COLUMN "employmentStatus" "EmploymentStatus";

UPDATE "Employee" SET "employmentStatus" = CASE WHEN "isActive" THEN 'ACTIVE' ELSE 'TERMINATED' END::"EmploymentStatus";

ALTER TABLE "Employee" ALTER COLUMN "employmentStatus" SET NOT NULL;
ALTER TABLE "Employee" ALTER COLUMN "employmentStatus" SET DEFAULT 'ACTIVE';

ALTER TABLE "Employee" DROP COLUMN "isActive";
