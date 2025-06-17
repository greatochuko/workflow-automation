/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `YoutubeContent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId]` on the table `YoutubeContent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "YoutubeContent_projectId_key" ON "YoutubeContent"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeContent_clientId_key" ON "YoutubeContent"("clientId");
