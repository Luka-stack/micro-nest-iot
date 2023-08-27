import postgres from 'postgres';

import { DynamicModule, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { ConfigService } from '@nestjs/config';

type DrizzleModuleOptions = {
  name: string;
  schema: any;
};

@Module({})
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
