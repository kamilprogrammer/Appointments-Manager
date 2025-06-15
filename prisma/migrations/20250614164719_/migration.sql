/*
  Warnings:

  - You are about to drop the column `chatSession` on the `Messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId]` on the table `Chats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `Chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_chatId_fkey";

-- AlterTable
ALTER TABLE "Chats" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "chatSession",
ALTER COLUMN "chatId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Chats_sessionId_key" ON "Chats"("sessionId");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;
