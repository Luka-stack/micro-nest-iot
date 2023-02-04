import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { MachineLabels } from '../dto/machine-labels';

@Injectable()
export class MiscService {
  constructor(private readonly prisma: PrismaService) {}

  async findMachineLabels(): Promise<MachineLabels> {
    const data = await Promise.all([
      this.prisma.producent.findMany(),
      this.prisma.type.findMany({ distinct: ['name'] }),
      this.prisma.model.findMany(),
    ]);

    return {
      producents: data[0],
      types: data[1],
      models: data[2],
    };
  }
}
