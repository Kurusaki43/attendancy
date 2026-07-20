-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'America/New_York';
