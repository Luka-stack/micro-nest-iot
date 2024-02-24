import 'dotenv/config';
import type { Config } from 'drizzle-kit';
import path from 'path';

export default {
  schema: './apps/machines/src/database/schema.ts',
  driver: 'pg',
  out: path.join('apps', 'machines', 'src', 'database', 'migrations'),
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
