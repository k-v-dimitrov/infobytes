import dotenv from 'dotenv';
dotenv.config();

import db from '@/modules/db';

async function main() {
  const allFacts = (await db()).getAllFacts();
  console.log(allFacts.map(fact => `fact-id: ${fact.id}`).join('\n'));
  process.exit(0);
}

main();
