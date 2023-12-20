import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(migrationClient);

const main = async () => {
  console.log('🐠 Migrating... 🐠');

  await migrate(db, {
    migrationsFolder: './src/database/migrations',
  });

  console.log('🐠 Migrated 🐠');
  process.exit(0);
};

main();
