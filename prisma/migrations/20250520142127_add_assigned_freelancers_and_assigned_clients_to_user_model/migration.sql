-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "User_id_key";

-- CreateTable
CREATE TABLE "_FreelancerToClient" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FreelancerToClient_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FreelancerToClient_B_index" ON "_FreelancerToClient"("B");

-- AddForeignKey
ALTER TABLE "_FreelancerToClient" ADD CONSTRAINT "_FreelancerToClient_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FreelancerToClient" ADD CONSTRAINT "_FreelancerToClient_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
