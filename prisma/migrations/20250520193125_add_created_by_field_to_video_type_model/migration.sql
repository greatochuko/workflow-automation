/*
  Warnings:

  - Added the required column `createdById` to the `VideoType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoType" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "VideoType" ADD CONSTRAINT "VideoType_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
