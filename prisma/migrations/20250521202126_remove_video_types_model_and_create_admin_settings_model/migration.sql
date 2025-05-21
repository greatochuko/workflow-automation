/*
  Warnings:

  - You are about to drop the `VideoType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VideoType" DROP CONSTRAINT "VideoType_createdById_fkey";

-- DropForeignKey
ALTER TABLE "VideoType" DROP CONSTRAINT "VideoType_userid_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "videoTypes" TEXT[];

-- DropTable
DROP TABLE "VideoType";

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "defaultTypes" TEXT[],

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);
