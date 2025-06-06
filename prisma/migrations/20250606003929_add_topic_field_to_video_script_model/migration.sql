/*
  Warnings:

  - You are about to drop the column `videoDescription` on the `VideoScript` table. All the data in the column will be lost.
  - Added the required column `description` to the `VideoScript` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `VideoScript` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoScript" DROP COLUMN "videoDescription",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "topic" TEXT NOT NULL;
