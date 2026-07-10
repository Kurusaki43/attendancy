-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "previousRefreshTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "previousRefreshTokenHash" TEXT;
