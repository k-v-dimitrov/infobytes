/*
  Warnings:

  - The primary key for the `viewed_facts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `viewed_facts` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `viewed_facts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "viewed_facts" DROP CONSTRAINT "viewed_facts_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "viewed_facts_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "viewed_facts_id_key" ON "viewed_facts"("id");

-- CreateIndex
CREATE INDEX "viewed_facts_user_id_idx" ON "viewed_facts"("user_id");
