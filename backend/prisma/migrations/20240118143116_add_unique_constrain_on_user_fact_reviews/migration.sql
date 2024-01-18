/*
  Warnings:

  - A unique constraint covering the columns `[userId,factId]` on the table `fact_reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "fact_reviews_userId_factId_key" ON "fact_reviews"("userId", "factId");
