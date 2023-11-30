-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_factId_fkey";

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_factId_fkey" FOREIGN KEY ("factId") REFERENCES "facts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
