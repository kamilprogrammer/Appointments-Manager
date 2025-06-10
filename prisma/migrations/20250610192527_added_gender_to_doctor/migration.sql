/*
  Warnings:

  - Added the required column `gender` to the `Doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctors" ADD COLUMN     "gender" TEXT NOT NULL;
