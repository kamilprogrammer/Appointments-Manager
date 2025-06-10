/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Patients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_patientId_fkey";

-- DropIndex
DROP INDEX "Users_doctorId_key";

-- DropIndex
DROP INDEX "Users_patientId_key";

-- AlterTable
ALTER TABLE "Doctors" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Patients" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "doctorId",
DROP COLUMN "patientId";

-- CreateIndex
CREATE UNIQUE INDEX "Doctors_userId_key" ON "Doctors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_userId_key" ON "Patients"("userId");

-- AddForeignKey
ALTER TABLE "Patients" ADD CONSTRAINT "Patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctors" ADD CONSTRAINT "Doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
