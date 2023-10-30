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

  return {
    getAllFacts: () => allFacts,
  };
};

export default db;
