-- AlterTable
ALTER TABLE "Doctors" ADD COLUMN     "address" TEXT,
ADD COLUMN     "dateofBirth" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" TEXT;
