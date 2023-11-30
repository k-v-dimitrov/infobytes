import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { readFileSync } from 'fs';
import * as path from 'path';
import { PrismaError } from 'prisma-error-enum';
const prisma = new PrismaClient();

function log(message?: any, ...optionalParams: any[]) {
  console.log('[SEEDER]: ', message, ...optionalParams);
}

async function seedFacts() {
  const rawJson = readFileSync(path.resolve(__dirname, 'facts.json'), 'utf-8');
  const json = JSON.parse(rawJson);

  await prisma.fact.createMany({
    data: json.facts,
  });
}

async function seedQuestions() {
  const rawJson = readFileSync(
    path.resolve(__dirname, 'questions.json'),
    'utf-8',
  );
  const json = JSON.parse(rawJson);
  const questions = json.questions;

  const enrichedQsWithFactIds = [];
  for (const q of questions) {
    try {
      const { id: factId } = await prisma.fact.findFirstOrThrow({
        where: { title: q.factTitle },
      });
      enrichedQsWithFactIds.push({ ...q, factId });
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
  log('Seeding facts...');
  await seedFacts();
  log('Seeding facts finished successfully!');
  log('Seeding Questions...!');
  await seedQuestions();
  log('Seeding Questions finished successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
