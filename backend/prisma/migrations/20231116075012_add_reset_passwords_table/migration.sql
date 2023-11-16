-- CreateTable
CREATE TABLE "reset_passwords" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "reset_passwords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_passwords_id_key" ON "reset_passwords"("id");

-- CreateIndex
CREATE UNIQUE INDEX "reset_passwords_userId_key" ON "reset_passwords"("userId");

-- AddForeignKey
ALTER TABLE "reset_passwords" ADD CONSTRAINT "reset_passwords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
