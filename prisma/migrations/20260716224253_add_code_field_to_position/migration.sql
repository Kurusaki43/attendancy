-- AlterTable
ALTER TABLE "Position" ADD COLUMN "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Position_code_key" ON "Position"("code");
