import { Injectable } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Injectable()
export class MiscRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProducents() {
    return await this.prisma.producent.findMany({});
  }

  async findTypesIncludeProducent() {
    return await this.prisma.type.findMany({
      include: {
        producents: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findModelsIncludeRelations() {
    return await this.prisma.model.findMany({
      include: {
        type: {
          select: {
            name: true,
          },
        },
        producent: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
