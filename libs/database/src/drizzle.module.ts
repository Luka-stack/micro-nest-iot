import postgres from 'postgres';

import { DynamicModule, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { ConfigService } from '@nestjs/config';

import * as schema from '../../../apps/machines/src/database/schema';
import { PG_CONNECTION } from '../../../apps/machines/src/constants';

type DrizzleModuleOptions = {
  name: string;
  schema: any;
};

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
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {
  static register({ name, schema }: DrizzleModuleOptions): DynamicModule {
    return {
      module: DrizzleModule,
      providers: [
        {
          provide: name,
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const connectionString = configService.get<string>('DATABASE_URL');
            const pool = postgres(connectionString);
            return drizzle(pool, { schema });
          },
        },
      ],
      exports: [name],
    };
  }
}
