import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { Machine as MachineModel } from '@prisma/db-machines';
import { MachineBo } from '../bos/machine.bo';
import { PrismaService } from './prisma.service';
import { CreateMachineDto } from '../dto/create-machine.dto';
import { QueryMachineDto } from '../dto/query-machine.dto';
import { UpdateMachineDto } from '../dto/update-machine.dto';

@Injectable()
export class MachinesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(machineDto: CreateMachineDto): Promise<MachineBo> {
    try {
      const data = {
        ...machineDto,
        productionRate: 10,
        status: 'IDLE' as MachineModel['status'],
        version: 1,
      };

      const machine = await this.prisma.machine.create({
        data,
      });

      return MachineBo.from(machine);
    } catch (err: unknown) {
      if (err.constructor.name === 'PrismaClientKnownRequestError') {
        if ((err as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
          throw new BadRequestException('Serial Number must be unique');
        }

        if ((err as Prisma.PrismaClientKnownRequestError).code === 'P2003') {
          throw new BadRequestException(
            'Some of the reference key are incorrect',
          );
        }
      }
    }

    throw new InternalServerErrorException('Could not create machine');
  }

  async findOne(serialNumber: string): Promise<MachineBo> {
    const machine = await this.prisma.machine.findUnique({
      where: { serialNumber: serialNumber },
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    return MachineBo.from(machine);
  }

  async update(
    serialNumber: string,
    machineDto: UpdateMachineDto,
  ): Promise<MachineBo> {
    const machine = await this.prisma.machine.findUnique({
      where: { serialNumber: serialNumber },
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    const data: Partial<MachineModel> = {};
    data.version = machine.version + 1;

    if (machineDto.status) {
      data.status = machineDto.status as MachineModel['status'];
      data.startedAt = machineDto.status === 'WORKING' ? new Date() : null;
    }

    if (machineDto.productionRate) {
      data.productionRate = machineDto.productionRate;
    }

    try {
      const machine = await this.prisma.machine.update({
        where: { serialNumber: serialNumber },
        data,
      });

      return MachineBo.from(machine);
    } catch (err) {
      throw new InternalServerErrorException('Could not create machine');
    }
  }

  async delete(serialNumber: string): Promise<void> {
    try {
      await this.prisma.machine.delete({
        where: { serialNumber: serialNumber },
      });

      return;
    } catch (err) {
      if (err.constructor.name === 'PrismaClientKnownRequestError') {
        if ((err as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
          throw new NotFoundException('Machine not found');
        }
      }

      throw new InternalServerErrorException('Could not create machine');
    }
  }

  async findMany(queryDto: QueryMachineDto): Promise<MachineBo[]> {
    const query = this.queryBuilder(queryDto);

    const machines = await this.prisma.machine.findMany({
      where: {
        AND: [
          { producent: query.producent },
          { type: query.type },
          { model: query.model },
          { status: query.status },
          { productionRate: query.productionRate },
          { startedAt: query.startedAt },
        ],
      },
    });

    return MachineBo.fromList(machines);
  }

  queryBuilder(queryDto: QueryMachineDto) {
    const query = {
      producent: {},
      type: {},
      model: {},
      status: {},
      productionRate: {},
      startedAt: {},
    };

    if (queryDto.producents) {
      query.producent = {
        in: queryDto.producents.split(','),
      };
    }

    if (queryDto.types) {
      query.type = {
        in: queryDto.types.split(','),
      };
    }

    if (queryDto.models) {
      query.model = { name: { in: queryDto.models.split(',') } };
    }

    if (queryDto.status) {
      query.status = {
        in: queryDto.status.split(',').map((status) => status.toUpperCase()),
      };
    }

    if (queryDto.rate) {
      query.productionRate[queryDto.rateFilter || 'equals'] = Number(
        queryDto.rate,
      );
    }

    if (queryDto.startedAt) {
      query.startedAt[queryDto.startedAtFilter || 'equals'] = new Date(
        queryDto.startedAt,
      );
    }

    return query;
  }
}
