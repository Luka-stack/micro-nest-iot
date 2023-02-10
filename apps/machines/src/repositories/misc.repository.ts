import { Injectable } from '@nestjs/common';

import { MachineModelBo } from '../bos/machine-model.bo';
import { MachineProducentBo } from '../bos/machine-producent.bo';
import { MachineTypeBo } from '../bos/machine-type.bo';
import { PrismaService } from './prisma.service';

@Injectable()
export class MiscRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProducents(): Promise<MachineProducentBo[]> {
    const producents = await this.prisma.producent.findMany();

    return MachineProducentBo.fromList(producents);
  }

  async findTypes(): Promise<MachineTypeBo[]> {
    const types = await this.prisma.type.findMany();

    return MachineTypeBo.fromList(types);
  }

  async findModels(): Promise<MachineModelBo[]> {
    const models = await this.prisma.model.findMany();

    return MachineModelBo.fromList(models);
  }
}
