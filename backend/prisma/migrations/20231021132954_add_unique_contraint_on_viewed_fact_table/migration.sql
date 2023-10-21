/*
  Warnings:

  - You are about to drop the `feeds` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "feeds";

-- CreateTable
CREATE TABLE "viewed_facts" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "fact_id" TEXT NOT NULL,

    CONSTRAINT "viewed_facts_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "viewed_facts_user_id_fact_id_key" ON "viewed_facts"("user_id", "fact_id");
