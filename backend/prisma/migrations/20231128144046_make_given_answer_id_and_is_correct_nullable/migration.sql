-- AlterTable
ALTER TABLE "user_questions" ALTER COLUMN "givenAnswerId" DROP NOT NULL,
ALTER COLUMN "isCorrect" DROP NOT NULL;
