/*
  Warnings:

  - You are about to drop the column `videoTypes` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "videoTypes";

-- AlterTable
ALTER TABLE "VideoType" ADD COLUMN     "userid" TEXT;

-- AddForeignKey
ALTER TABLE "VideoType" ADD CONSTRAINT "VideoType_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
