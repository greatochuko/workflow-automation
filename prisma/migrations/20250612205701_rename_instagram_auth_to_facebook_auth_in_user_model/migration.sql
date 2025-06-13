/*
  Warnings:

  - You are about to drop the column `instagramAuth` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "instagramAuth",
ADD COLUMN     "facebookAuth" JSONB;
