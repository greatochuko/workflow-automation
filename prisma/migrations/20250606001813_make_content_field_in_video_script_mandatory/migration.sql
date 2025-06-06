/*
  Warnings:

  - Made the column `content` on table `VideoScript` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "VideoScript" ALTER COLUMN "content" SET NOT NULL;
