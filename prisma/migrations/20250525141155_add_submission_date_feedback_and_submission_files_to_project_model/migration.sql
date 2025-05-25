-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "feedback" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "submissionDate" TIMESTAMP(3),
ADD COLUMN     "submissionFiles" JSONB[] DEFAULT ARRAY[]::JSONB[];
