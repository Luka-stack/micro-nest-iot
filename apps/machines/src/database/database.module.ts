import postgres from 'postgres';

import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { ConfigService } from '@nestjs/config';

import * as schema from './schema';
import { PG_CONNECTION } from '../constants';
import { DrizzleMiscRepository } from './misc.repository';

@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');
        const pool = postgres(connectionString);
        return drizzle(pool, { schema });
      },
    },
    DrizzleMiscRepository,
  ],
  exports: [DrizzleMiscRepository],
})
export class DatabaseModule {}
