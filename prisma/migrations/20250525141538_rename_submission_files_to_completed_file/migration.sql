/*
  Warnings:

  - You are about to drop the column `submissionFiles` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "submissionFiles",
ADD COLUMN     "completedFile" JSONB;
