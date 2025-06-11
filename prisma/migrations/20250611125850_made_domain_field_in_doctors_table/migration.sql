/*
  Warnings:

  - You are about to drop the column `role` on the `Doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctors" DROP COLUMN "role",
ADD COLUMN     "domain" TEXT;
