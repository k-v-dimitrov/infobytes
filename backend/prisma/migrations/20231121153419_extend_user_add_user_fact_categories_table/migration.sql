-- AlterTable
ALTER TABLE "users" ADD COLUMN     "displayName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "user_fact_categories" (
    "id" TEXT NOT NULL,
    "category" "FactCategories" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_fact_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_fact_categories_id_key" ON "user_fact_categories"("id");

-- AddForeignKey
ALTER TABLE "user_fact_categories" ADD CONSTRAINT "user_fact_categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
