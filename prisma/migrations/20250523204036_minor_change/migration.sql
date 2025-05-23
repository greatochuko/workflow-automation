/*
  Warnings:

  - You are about to drop the column `createdByid` on the `Project` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_createdByid_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "createdByid",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
