import { Prisma } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { Machine as MachineModel } from '@prisma/db-machines';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

import { PrismaService } from '../database/prisma.service';
import { FindMachineDto } from '../dto/find-machine.dto';
import { QueryMachineDto } from '../dto/query-machine.dto';
import { UpdateMachineDto } from '../dto/update-machine.dto';
import { CreateMachineDto } from '../dto/create-machine.dto';

@Injectable()
export class MachinesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('KEPWARE') private readonly billingClient: ClientProxy,
  ) {}

  async createMachine(machineDto: CreateMachineDto): Promise<MachineModel> {
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

  // TODO has to be route parameter
  async findOne(machineDto: FindMachineDto): Promise<MachineModel> {
    const machine = await this.prisma.machine.findUnique({
      where: { serialNumber: machineDto.serialNumber },
    });

    if (!machine) {
      throw new BadRequestException('Machine not found');
    }

    return machine;
  }

  async query(machineDto: QueryMachineDto): Promise<MachineModel[]> {
    const query = this.queryBuilder(machineDto);

    return this.prisma.machine.findMany({
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
  }

  async patch(
    serialNumber: string,
    machineDto: UpdateMachineDto,
  ): Promise<MachineModel> {
    const data: Partial<MachineModel> = {};

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
        data: data,
      });

      return machine;
    } catch (err) {
      if (err.constructor.name === 'PrismaClientKnownRequestError') {
        if ((err as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
          throw new NotFoundException('Machine not found');
        }
      }
    }

    throw new InternalServerErrorException('Could not create machine');
  }

  async destroy(serialNumber: string): Promise<void> {
    try {
      await this.prisma.machine.delete({
        where: { serialNumber: serialNumber },
      });
    } catch (err) {
      if (err.constructor.name === 'PrismaClientKnownRequestError') {
        if ((err as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
          throw new NotFoundException('Machine not found');
        }
      }

      throw new InternalServerErrorException('Could not create machine');
    }
  }

  queryBuilder(machineDto: QueryMachineDto) {
    const query = {
      producent: {},
      type: {},
      model: {},
      status: {},
      productionRate: {},
      startedAt: {},
    };

    if (machineDto.producents) {
      query.producent = {
        in: machineDto.producents.split(','),
      };
    }

    if (machineDto.types) {
      query.type = {
        in: machineDto.types.split(','),
      };
    }

    if (machineDto.models) {
      query.model = { name: { in: machineDto.models.split(',') } };
    }

    if (machineDto.status) {
      query.status = {
        in: machineDto.status.split(',').map((status) => status.toUpperCase()),
      };
    }

    if (machineDto.rate) {
      query.productionRate[machineDto.rateFilter || 'equals'] = Number(
        machineDto.rate,
      );
    }

    if (machineDto.startedAt) {
      query.startedAt[machineDto.startedAtFilter || 'equals'] = new Date(
        machineDto.startedAt,
      );
    }

    return query;
  }

  // changeStatus(request: { name: string; on: boolean }) {
  //   this.billingClient.emit('device_status', {
  //     request,
  //   });
  //   return { name: request.name, on: request.on };
  // }
}
