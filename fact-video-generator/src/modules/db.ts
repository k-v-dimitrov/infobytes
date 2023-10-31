import { log } from '@/utils';
import knex from 'knex';

const { DATABASE_URL } = process.env;

// Caution: This type is incomplete
interface Fact {
  id: string;
  text: string;
  title: string;
  categoryType: string;
}

const db = async () => {
  const db = knex({
    client: 'pg',
    connection: DATABASE_URL,
  });

  const query = db.queryBuilder();
  const allFacts: Array<Fact> = await query.select('*').from('facts');
  log('DB', 'Pulled facts from db');

  return {
    getAllFacts: () => {
      log('DB', 'Retrieved all facts');
      return allFacts;
    },
  };
};

export default db;
