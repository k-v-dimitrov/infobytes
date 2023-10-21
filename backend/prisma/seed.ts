import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import * as path from 'path';
const prisma = new PrismaClient();

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

async function main() {
  log('Seeding facts...');
  await seedFacts();
  log('Seeding facts finished successfully!');
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
