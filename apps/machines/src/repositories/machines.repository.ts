import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SQLWrapper,
  and,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  like,
  lt,
  lte,
  sql,
} from 'drizzle-orm';

import * as schema from '../database/schema';
import { NOT_ASSIGNED } from '../app.types';
import { PG_CONNECTION } from '../constants';
import { QueryMachineDto } from '../dto/incoming/query-machine.dto';
import { ReportMaintenanceDto } from '../dto/incoming/report-maintenance.dto';
import { Machine, MachineColumns, MaintainInfo } from '../bos/machine';

@Injectable()
export class MachinesRepository {
  private readonly defaultLimit = 10;

  constructor(
    @Inject(PG_CONNECTION)
    private readonly conn: PostgresJsDatabase<typeof schema>,
  ) {}

  findMachineHistory(serialNumber: string) {
    return this.conn.query.PGMaintenanceHistory.findMany({
      where: eq(schema.PGMaintenanceHistory.machineSerialNumber, serialNumber),
    });
  }

  async findOne(serialNumber: string, columns?: MachineColumns) {
    if (!columns) {
      const machine = await this.conn.query.PGMachine.findFirst({
        where: eq(schema.PGMachine.serialNumber, serialNumber),
      });

      if (!machine) {
        throw new NotFoundException('Machine not found');
      }

      return machine;
    }

    const machine = await this.conn.query.PGMachine.findFirst({
      where: eq(schema.PGMachine.serialNumber, serialNumber),
      with: columns,
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    return machine;
  }

  findStatus(serialNumber: string) {
    return this.conn.query.PGMachine.findFirst({
      columns: { status: true },
      where: eq(schema.PGMachine.serialNumber, serialNumber),
    });
  }

  async update(
    serialNumber: string,
    machineData: Partial<Machine>,
    newVersion: number,
  ) {
    const data: Partial<Machine> = {
      ...machineData,
      statusVersion: newVersion,
    };

    const updated = await this.conn
      .update(schema.PGMachine)
      .set(data)
      .where(eq(schema.PGMachine.serialNumber, serialNumber))
      .returning();

    return updated[0];
  }

  async updateMaintainInfo(id: number, maintainInfo: Partial<MaintainInfo>) {
    const updated = await this.conn
      .update(schema.PGMachineMaintainInfo)
      .set(maintainInfo)
      .where(eq(schema.PGMachineMaintainInfo.id, id))
      .returning();

    return updated[0];
  }

  async assignEmployee(serialNumber: string, employee: string | null) {
    const machine = await this.conn.query.PGMachine.findFirst({
      where: eq(schema.PGMachine.serialNumber, serialNumber),
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    const updated = await this.conn
      .update(schema.PGMachine)
      .set({
        assignedEmployee: employee,
        accessVersion: machine.accessVersion + 1,
      })
      .where(eq(schema.PGMachine.serialNumber, serialNumber))
      .returning();

    return updated[0];
  }

  async assignMaintainer(serialNumber: string, maintainer: string) {
    const machine = await this.conn.query.PGMachine.findFirst({
      where: eq(schema.PGMachine.serialNumber, serialNumber),
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    if (machine.assignedMaintainer !== null) {
      throw new Error('Machine already has maintainer');
    }

    const updated = await this.conn
      .update(schema.PGMachine)
      .set({ assignedMaintainer: maintainer })
      .where(eq(schema.PGMachine.serialNumber, serialNumber))
      .returning();

    return updated[0];
  }

  async unassignMaintainer(serialNumber: string, maintainer: string) {
    await this.conn
      .update(schema.PGMachine)
      .set({ assignedMaintainer: null })
      .where(
        and(
          eq(schema.PGMachine.serialNumber, serialNumber),
          eq(schema.PGMachine.assignedMaintainer, maintainer),
        ),
      );
  }

  async reportMaintenance(
    machine: Machine & { maintainInfo: MaintainInfo },
    defects: string[],
    body: ReportMaintenanceDto,
  ) {
    return await this.conn.transaction(async (trx) => {
      await trx.insert(schema.PGMaintenanceHistory).values({
        machineSerialNumber: machine.serialNumber,
        description: body.description,
        date: new Date(),
        maintainer: machine.assignedMaintainer,
        nextMaintenance: new Date(body.nextMaintenance),
        scheduled: machine.maintainInfo.maintenance,
        type: machine.status === 'BROKEN' ? 'REPAIR' : 'MAINTENANCE',
      });

      const updated = await trx
        .update(schema.PGMachine)
        .set({
          status: 'IDLE',
          assignedMaintainer: null,
          statusVersion: machine.statusVersion + 1,
        })
        .where(eq(schema.PGMachine.id, machine.id))
        .returning();

      await trx
        .update(schema.PGMachineMaintainInfo)
        .set({
          maintenance: new Date(body.nextMaintenance),
          defects,
        })
        .where(eq(schema.PGMachineMaintainInfo.id, machine.maintainInfo.id));

      return updated[0];
    });
  }

  async query(queryDto: QueryMachineDto) {
    const where = this.queryBuilder(queryDto);

    const limit = Number(queryDto.limit) || this.defaultLimit;
    const offset = Number(queryDto.offset) || 0;

    const queryMachines = this.conn.query.PGMachine.findMany({
      limit,
      offset: sql.placeholder('offset'),
      with: {
        type: true,
        model: true,
        maintainInfo: true,
      },
      where,
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
    const innerQuery: SQLWrapper[] = [];
    let tmp: any;

    if (queryDto.employee) {
      if (queryDto.employee === NOT_ASSIGNED) {
        query.push(isNull(schema.PGMachine.assignedEmployee));
      } else {
        query.push(eq(schema.PGMachine.assignedEmployee, queryDto.employee));
      }
    }

    if (queryDto.maintainer) {
      if (queryDto.maintainer === NOT_ASSIGNED) {
        query.push(isNull(schema.PGMachine.assignedMaintainer));
      } else {
        query.push(
          eq(schema.PGMachine.assignedMaintainer, queryDto.maintainer),
        );
      }
    }

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

    if (queryDto.priority) {
      innerQuery.push(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        eq(schema.PGMachineMaintainInfo.priority, queryDto.priority),
      );
    }

    if (queryDto.nextMaintenance) {
      const from = new Date();
      const to = new Date();

      from.setDate(from.getDate() + Number(queryDto.nextMaintenance));
      to.setDate(to.getDate() + Number(queryDto.nextMaintenance) + 1);

      to.setHours(1, 0, 0, 0);
      from.setHours(1, 0, 0, 0);

      innerQuery.push(
        gte(schema.PGMachineMaintainInfo.maintenance, from),
        lt(schema.PGMachineMaintainInfo.maintenance, to),
      );
    }

    if (innerQuery.length) {
      return and(
        ...query,
        inArray(
          schema.PGMachine.id,
          this.conn
            .select({ id: schema.PGMachineMaintainInfo.id })
            .from(schema.PGMachineMaintainInfo)
            .where(and(...innerQuery)),
        ),
      );
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
