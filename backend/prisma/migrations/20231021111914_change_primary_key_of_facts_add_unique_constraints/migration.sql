/*
  Warnings:

  - The primary key for the `fact_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `fact_categories` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `facts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `fact_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `facts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "facts" DROP CONSTRAINT "facts_categoryId_fkey";

-- AlterTable
ALTER TABLE "fact_categories" DROP CONSTRAINT "fact_categories_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "fact_categories_pkey" PRIMARY KEY ("type");

-- AlterTable
ALTER TABLE "facts" DROP COLUMN "categoryId",
ADD COLUMN     "categoryType" "FactCategories";

-- CreateIndex
CREATE UNIQUE INDEX "fact_categories_type_key" ON "fact_categories"("type");

-- CreateIndex
CREATE UNIQUE INDEX "facts_id_key" ON "facts"("id");

-- AddForeignKey
ALTER TABLE "facts" ADD CONSTRAINT "facts_categoryType_fkey" FOREIGN KEY ("categoryType") REFERENCES "fact_categories"("type") ON DELETE SET NULL ON UPDATE CASCADE;
