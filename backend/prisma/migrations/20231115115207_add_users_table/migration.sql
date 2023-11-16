/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `feed_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `feed_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feed_users" ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "feed_users_user_id_key" ON "feed_users"("user_id");

-- AddForeignKey
ALTER TABLE "feed_users" ADD CONSTRAINT "feed_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
