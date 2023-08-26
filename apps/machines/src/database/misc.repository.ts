import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { PG_CONNECTION } from '../constants';
import * as schema from './schema';

@Injectable()
export class DrizzleMiscRepository {
  constructor(
    @Inject(PG_CONNECTION)
    private readonly conn: PostgresJsDatabase<typeof schema>,
  ) {}

  findProducents() {
    return this.conn.select().from(schema.PGProducent);
  }

  async findTypes() {
    const types = await this.conn.query.PGProducentsToTypes.findMany({
      columns: {},
      with: {
        producent: {
          columns: {
            name: true,
          },
        },
        type: true,
      },
    });

    const typeMap = new Map<number, (typeof types)[number]>();
    const producentMap = new Map<number, { name: string }[]>();

    types.forEach((obj) => {
      if (!producentMap.has(obj.type.id)) {
        producentMap.set(obj.type.id, []);
      }

      producentMap.get(obj.type.id).push(obj.producent);

      if (!typeMap.get(obj.type.id)) {
        typeMap.set(obj.type.id, obj);
      }
    });

    return Array.from(typeMap.values()).map((type) => {
      delete type.producent;

      return {
        ...type,
        producents: producentMap.get(type.type.id) || [],
      };
    });
  }

  findModels() {
    return this.conn.query.PGModel.findMany({
      with: {
        producent: {
          columns: {
            name: true,
          },
        },
        type: {
          columns: {
            name: true,
          },
        },
      },
    });
  }
}
