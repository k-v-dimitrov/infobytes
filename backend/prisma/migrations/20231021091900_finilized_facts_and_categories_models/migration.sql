/*
  Warnings:

  - Added the required column `sourceUrl` to the `facts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `facts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `facts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `facts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FactCategories" AS ENUM ('history', 'cinema', 'technology', 'art', 'sport', 'fashion', 'science', 'geography');

-- AlterTable
ALTER TABLE "facts" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sourceUrl" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "fact_categories" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "FactCategories" NOT NULL,

    CONSTRAINT "fact_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "facts" ADD CONSTRAINT "facts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "fact_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
