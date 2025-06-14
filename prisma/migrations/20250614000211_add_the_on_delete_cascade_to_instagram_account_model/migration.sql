-- DropForeignKey
ALTER TABLE "InstagramAccount" DROP CONSTRAINT "InstagramAccount_userId_fkey";

-- AddForeignKey
ALTER TABLE "InstagramAccount" ADD CONSTRAINT "InstagramAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
