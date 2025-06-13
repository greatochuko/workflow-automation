-- CreateEnum
CREATE TYPE "ProjectPublishStatus" AS ENUM ('PENDING', 'POSTED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "publishStatus" "ProjectPublishStatus" NOT NULL DEFAULT 'PENDING';
