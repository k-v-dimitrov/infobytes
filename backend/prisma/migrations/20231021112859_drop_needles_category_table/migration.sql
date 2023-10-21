/*
  Warnings:

  - You are about to drop the `fact_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "facts" DROP CONSTRAINT "facts_categoryType_fkey";

-- DropTable
DROP TABLE "fact_categories";
