// Populates the questions from prisma/questions.json to a live (non-fresh) database
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { readFileSync } from 'fs';
import * as path from 'path';
import { PrismaError } from 'prisma-error-enum';

const prisma = new PrismaClient();

function log(message?: any, ...optionalParams: any[]) {
  console.log('[SCRIPT]: ', message, ...optionalParams);
}

async function seedQuestions() {
  const rawJson = readFileSync(
    path.resolve(__dirname, '../prisma/questions.json'),
    'utf-8',
  );
  const json = JSON.parse(rawJson);
  const questions = json.questions;

  const enrichedQsWithFactIds = [];
  for (const q of questions) {
    try {
      const { id: factId, Question: alreadyAssociatedQuestions } =
        await prisma.fact.findFirstOrThrow({
          where: { title: q.factTitle },
          include: { Question: true },
        });

      const alreadyAdded = q.data.find(({ questionText }) =>
        alreadyAssociatedQuestions.find(
          ({ questionText: cText }) => questionText === cText,
        ),
      );

      if (!alreadyAdded) {
        enrichedQsWithFactIds.push({ ...q, factId });
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === PrismaError.RecordsNotFound) {
          log(
            `[ERROR]: Could not fact with title "${q.factTitle}". Skipping...`,
          );
        }
      }
    }
  }

  log(`Will add ${enrichedQsWithFactIds.length} questions...`);

  for (const q of enrichedQsWithFactIds) {
    for (const qData of q.data) {
      const { id: newQuestionId } = await prisma.question.create({
        data: {
          factId: q.factId,
          questionText: qData.questionText,
        },
      });

      await prisma.answer.createMany({
        data: qData.answers.map((answerData) => ({
          ...answerData,
          questionId: newQuestionId,
        })),
      });
    }
  }
}

async function main() {
  log('Seeding Questions...!');
  await seedQuestions();
  log('Seeding Questions finished successfully!');
}

main();
