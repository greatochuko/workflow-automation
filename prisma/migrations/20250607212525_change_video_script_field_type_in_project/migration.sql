/*
  Warnings:

  - You are about to drop the column `projectId` on the `VideoScript` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VideoScript" DROP CONSTRAINT "VideoScript_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "videoScriptId" TEXT;

-- AlterTable
ALTER TABLE "VideoScript" DROP COLUMN "projectId";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_videoScriptId_fkey" FOREIGN KEY ("videoScriptId") REFERENCES "VideoScript"("id") ON DELETE SET NULL ON UPDATE CASCADE;
