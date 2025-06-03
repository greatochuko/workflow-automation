-- AlterTable
ALTER TABLE "User" ADD COLUMN     "basicInstructions" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "examples" TEXT[],
ADD COLUMN     "monthlyCredits" INTEGER NOT NULL DEFAULT 0;
