import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Machine as MachineModel } from '@prisma/db-machines';

import { PrismaService } from './prisma.service';
import { CreateMachineDto } from '../dto/incoming/create-machine.dto';
import { QueryMachineDto } from '../dto/incoming/query-machine.dto';
import { UpdateMachineDto } from '../dto/incoming/update-machine.dto';

@Injectable()
export class MachinesRepository {
  private readonly defaultLimit = 10;
  private totalCount = 0;

  constructor(private readonly prisma: PrismaService) {}

  async getTotalCount(): Promise<number> {
    if (this.totalCount === 0) {
      this.totalCount = await this.prisma.machine.count();
    }

    return this.totalCount;
  }

  async create(machineDto: CreateMachineDto) {
    try {
      const data = {
        ...machineDto,
        imageUrl: MachinesRepository.generateImage(machineDto.type),
        productionRate: 10,
        status: 'IDLE' as MachineModel['status'],
        version: 1,
      };

      const machine = await this.prisma.machine.create({
        data,
      });

      this.totalCount += 1;

      return machine;
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

  async findOne(serialNumber: string) {
    const machine = await this.prisma.machine.findUnique({
      where: { serialNumber: serialNumber },
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    return machine;
  }

  async update(serialNumber: string, machineDto: UpdateMachineDto) {
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

      return machine;
    } catch (err) {
      throw new InternalServerErrorException('Could not create machine');
    }
  }

  async delete(serialNumber: string): Promise<void> {
    try {
      await this.prisma.machine.delete({
        where: { serialNumber: serialNumber },
      });

      this.totalCount -= 1;
    } catch (err) {
      if (err.constructor.name === 'PrismaClientKnownRequestError') {
        if ((err as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
          throw new NotFoundException('Machine not found');
        }
      }

      throw new InternalServerErrorException('Could not create machine');
    }
  }

  async findMany(queryDto: QueryMachineDto) {
    const query = this.queryBuilder(queryDto);

    const take = Number(queryDto.limit) || this.defaultLimit;
    const skip = Number(queryDto.offset) || 0;

    return await this.prisma.machine.findMany({
      where: {
        AND: query,
      },
      take,
      skip,
    });
  }

  queryBuilder(queryDto: QueryMachineDto) {
    const query = [];

    if (queryDto.serialNumber) {
      query.push({
        serialNumber: {
          contains: queryDto.serialNumber,
        },
      });
    }

    if (queryDto.producents) {
      query.push({
        producent: {
          in: queryDto.producents.split(','),
        },
      });
    }

    if (queryDto.types) {
      query.push({
        type: {
          in: queryDto.types.split(','),
        },
      });
    }

    if (queryDto.models) {
      query.push({ model: { in: queryDto.models.split(',') } });
    }

    if (queryDto.status) {
      query.push({
        status: {
          in: queryDto.status.split(',').map((status) => status.toUpperCase()),
        },
      });
    }

    if (queryDto.rate) {
      const productionRate = {};
      productionRate[queryDto.rateFilter || 'equals'] = Number(queryDto.rate);

      query.push({ productionRate });
    }

    if (queryDto.startedAt) {
      const startedAt = {};
      startedAt[queryDto.startedAtFilter || 'equals'] = new Date(
        queryDto.startedAt,
      );

      query.push({ startedAt });
    }

    return query;
  }

  private static generateImage(type: string): string {
    switch (type) {
      case 'Grabers':
        return 'machine.png';
      case 'Multies':
        return 'machine.png';
      default:
        return 'not-found.png';
    }
  }
}
