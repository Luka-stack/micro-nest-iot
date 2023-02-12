import {
  MachineCreatedMessage,
  MachineUpdatedMessage,
} from '@iot/communication';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MachineBo } from '../bos/machine.bo';

import { PrismaService } from './prisma.service';

@Injectable()
export class KepwareRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: MachineCreatedMessage['data']): Promise<void> {
    try {
      await this.prisma.machine.create({
        data,
      });
    } catch (err) {
      if (err.constructor.name === 'PrismaClientKnownRequestError') {
        if ((err as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
          throw new BadRequestException('Serial Number must be unique');
        }
      }
    }
  }

  async update(data: MachineUpdatedMessage['data']): Promise<void> {
    const machine = await this.prisma.machine.findUnique({
      where: { serialNumber: data.serialNumber },
    });

    if (!machine) {
      throw new NotFoundException('Machine Not Found');
    }

    if (machine.version + 1 !== data.version) {
      throw new BadRequestException('Bad version');
    }

    const { serialNumber, ...rest } = data;

    try {
      await this.prisma.machine.update({
        where: { serialNumber: machine.serialNumber },
        data: rest,
      });
    } catch (err) {
      if (err.constructor.name === 'PrismaClientKnownRequestError') {
        if ((err as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
          throw new NotFoundException('Machine not found');
        }
      }
    }
  }

  async findMany(): Promise<MachineBo[]> {
    const machines = await this.prisma.machine.findMany();
    return MachineBo.fromList(machines);
  }

  async delete(serialNumber: string): Promise<void> {
    try {
      await this.prisma.machine.delete({
        where: { serialNumber },
      });
    } catch (err) {
      if (err.constructor.name === 'PrismaClientKnownRequestError') {
        if ((err as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
          throw new NotFoundException('Machine not found');
        }
      }
    }
  }
}
