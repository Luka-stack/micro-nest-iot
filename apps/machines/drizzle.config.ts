import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './apps/machines/src/database/schema.ts',
  driver: 'pg',
  out: './apps/machines/src/database/migrations',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
