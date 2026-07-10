-- AlterTable
ALTER TABLE "Department" ADD COLUMN "code" TEXT;

-- Backfill existing rows with a deterministic, unique placeholder code.
-- Real deployments should follow up with intentional codes (see prisma/seeds/seed-departments.ts).
UPDATE "Department"
SET "code" = UPPER(LEFT(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '', 'g'), 6)) || '_' || RIGHT(id, 4)
WHERE "code" IS NULL;

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "code" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");
