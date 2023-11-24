import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SQLWrapper,
  and,
  eq,
  gt,
  gte,
  inArray,
  like,
  lt,
  lte,
  sql,
} from 'drizzle-orm';

import * as schema from '../database/schema';
import { PG_CONNECTION } from '../constants';
import { QueryMachineDto } from '../dto/incoming/query-machine.dto';
import { UpdateMachineDto } from '../dto/incoming/update-machine.dto';

@Injectable()
export class MachinesRepository {
  private readonly defaultLimit = 10;

  constructor(
    @Inject(PG_CONNECTION)
    private readonly conn: PostgresJsDatabase<typeof schema>,
  ) {}

  findOne(serialNumber: string) {
    return this.conn.query.PGMachine.findFirst({
      where: eq(schema.PGMachine.serialNumber, serialNumber),
      with: { model: true, type: true },
    });
  }

  findStatus(serialNumber: string) {
    return this.conn.query.PGMachine.findFirst({
      columns: { status: true },
      where: eq(schema.PGMachine.serialNumber, serialNumber),
    });
  }

  async update(serialNumber: string, machineDto: UpdateMachineDto) {
    const machine = await this.conn.query.PGMachine.findFirst({
      where: eq(schema.PGMachine.serialNumber, serialNumber),
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    const data: Partial<typeof machine> = {
      ...machineDto,
      version: machine.version + 1,
    };

    if (machineDto.status) {
      data.lastStatusUpdate = new Date();
    }

    const updated = await this.conn
      .update(schema.PGMachine)
      .set(data)
      .where(eq(schema.PGMachine.serialNumber, serialNumber))
      .returning();

    return updated[0];
  }

  async query(queryDto: QueryMachineDto) {
    const where = this.queryBuilder(queryDto);

    const limit = Number(queryDto.limit) || this.defaultLimit;
    const offset = Number(queryDto.offset) || 0;

    const queryMachines = this.conn.query.PGMachine.findMany({
      where,
      limit,
      offset: sql.placeholder('offset'),
      with: {
        type: true,
        model: true,
      },
      orderBy: schema.PGMachine.serialNumber,
    }).prepare('query_machines');

    const queryTotal = this.conn
      .select({
        count: sql<number>`cast(count(${schema.PGMachine.id}) as int)`,
      })
      .from(schema.PGMachine)
      .where(where)
      .prepare('total_machines');

    const [machines, total] = await Promise.all([
      queryMachines.execute({ offset }),
      queryTotal.execute(),
    ]);

    return {
      data: machines,
      total: total[0].count,
    };
  }

  queryBuilder(queryDto: QueryMachineDto) {
    const query: SQLWrapper[] = [];
    let tmp: any;

    if (queryDto.serialNumber) {
      query.push(
        like(schema.PGMachine.serialNumber, `%${queryDto.serialNumber}%`),
      );
    }

    if (queryDto.producents) {
      tmp = queryDto.producents.split(',');
      query.push(inArray(schema.PGMachine.producent, tmp));
    }

    if (queryDto.status) {
      tmp = queryDto.status.split(',').map((v) => v.toUpperCase());
      query.push(inArray(schema.PGMachine.status, tmp));
    }

    if (queryDto.rate) {
      tmp = this.getCompareMethod(queryDto.rateFilter);
      query.push(tmp(schema.PGMachine.productionRate, Number(queryDto.rate)));
    }

    if (queryDto.startedAt) {
      tmp = this.getCompareMethod(queryDto.startedAtFilter);
      const date = new Date(queryDto.startedAt);
      date.setHours(0, 0, 0, 0);

      query.push(tmp(schema.PGMachine.lastStatusUpdate, date));
    }

    if (queryDto.types) {
      query.push(inArray(schema.PGMachine.type, queryDto.types.split(',')));
    }

    if (queryDto.models) {
      query.push(inArray(schema.PGMachine.type, queryDto.models.split(',')));
    }

    return and(...query);
  }

  private getCompareMethod(filter: string) {
    switch (filter) {
      case 'eq':
        return eq;

      case 'gt':
        return gt;

      case 'gte':
        return gte;

      case 'lt':
        return lt;

      case 'lte':
        return lte;

      default:
        return eq;
    }
  }
}
