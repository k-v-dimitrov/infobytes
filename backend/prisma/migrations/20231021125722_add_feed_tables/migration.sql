-- CreateTable
CREATE TABLE "feed_users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feed_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeds" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "fact_id" TEXT NOT NULL,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feed_users_id_key" ON "feed_users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "feeds_user_id_key" ON "feeds"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "feeds_fact_id_key" ON "feeds"("fact_id");
