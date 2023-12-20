import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/schema.ts',
  driver: 'pg',
  out: './src/database/migrations',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
