/*
  Warnings:

  - Added the required column `isActive` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "isActive" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "isActive" BOOLEAN NOT NULL;
