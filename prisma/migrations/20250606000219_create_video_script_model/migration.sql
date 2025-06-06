-- CreateTable
CREATE TABLE "VideoScript" (
    "id" TEXT NOT NULL,
    "content" JSONB,
    "videoDescription" TEXT NOT NULL,
    "durationInSeconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "VideoScript_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VideoScript" ADD CONSTRAINT "VideoScript_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoScript" ADD CONSTRAINT "VideoScript_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
