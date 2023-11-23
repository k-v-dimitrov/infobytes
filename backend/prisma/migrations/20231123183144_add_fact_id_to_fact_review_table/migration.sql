/*
  Warnings:

  - Added the required column `factId` to the `fact_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fact_reviews" ADD COLUMN     "factId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "fact_reviews" ADD CONSTRAINT "fact_reviews_factId_fkey" FOREIGN KEY ("factId") REFERENCES "facts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
