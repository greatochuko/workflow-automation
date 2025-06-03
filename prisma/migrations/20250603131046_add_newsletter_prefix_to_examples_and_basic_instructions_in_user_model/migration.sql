/*
  Warnings:

  - You are about to drop the column `basicInstructions` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `examples` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "basicInstructions",
DROP COLUMN "examples",
ADD COLUMN     "newsLetterBasicInstructions" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "newsletterExamples" TEXT[];
