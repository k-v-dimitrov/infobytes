/*
  Warnings:

  - You are about to drop the column `user_id` on the `viewed_facts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_feed_id,fact_id]` on the table `viewed_facts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_feed_id` to the `viewed_facts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "viewed_facts_user_id_fact_id_key";

-- DropIndex
DROP INDEX "viewed_facts_user_id_idx";

-- AlterTable
ALTER TABLE "viewed_facts" DROP COLUMN "user_id",
ADD COLUMN     "user_feed_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "viewed_facts_user_feed_id_idx" ON "viewed_facts"("user_feed_id");

-- CreateIndex
CREATE UNIQUE INDEX "viewed_facts_user_feed_id_fact_id_key" ON "viewed_facts"("user_feed_id", "fact_id");
