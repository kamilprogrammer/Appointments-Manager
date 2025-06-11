/*
  Warnings:

  - You are about to drop the column `EndDate` on the `Appointments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointments" DROP COLUMN "EndDate",
ADD COLUMN     "endDate" TIMESTAMP(3);
